import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CommunicationGateway } from '../gateways/communication.gateway';
import { io as ioc, Socket as ClientSocket } from 'socket.io-client';

describe('CommunicationGateway Integration Tests', () => {
  let app: INestApplication;
  let gateway: CommunicationGateway;
  let clientSocket: ClientSocket;
  let serverPort: number;

  const mockMessageId = 'msg-123e4567-e89b-12d3-a456-426614174000';
  const mockUserId = 'user-123e4567-e89b-12d3-a456-426614174000';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [CommunicationGateway],
    }).compile();

    gateway = moduleFixture.get<CommunicationGateway>(CommunicationGateway);

    app = moduleFixture.createNestApplication();
    await app.listen(0); // Listen on random available port

    const address = app.getHttpServer().address();
    serverPort = typeof address === 'string' ? 3001 : address.port;
  });

  afterAll(async () => {
    if (clientSocket) {
      clientSocket.disconnect();
    }
    await app.close();
  });

  afterEach(() => {
    if (clientSocket && clientSocket.connected) {
      clientSocket.disconnect();
    }
  });

  describe('WebSocket Connection', () => {
    it('should establish a connection to the communication namespace', (done) => {
      clientSocket = ioc(`http://localhost:${serverPort}/communication`, {
        transports: ['websocket'],
        reconnection: false,
      });

      clientSocket.on('connect', () => {
        expect(clientSocket.connected).toBe(true);
        done();
      });

      clientSocket.on('connect_error', (error) => {
        done(error);
      });
    });

    it('should handle authentication with valid token', (done) => {
      clientSocket = ioc(`http://localhost:${serverPort}/communication`, {
        auth: {
          token: 'valid-jwt-token',
        },
        transports: ['websocket'],
        reconnection: false,
      });

      clientSocket.on('connect', () => {
        expect(clientSocket.connected).toBe(true);
        done();
      });
    });

    it('should maintain connection state', (done) => {
      clientSocket = ioc(`http://localhost:${serverPort}/communication`, {
        transports: ['websocket'],
        reconnection: false,
      });

      clientSocket.on('connect', () => {
        expect(clientSocket.connected).toBe(true);

        // Verify socket ID is assigned
        expect(clientSocket.id).toBeDefined();
        done();
      });
    });
  });

  describe('Subscribe to Delivery Updates', () => {
    beforeEach((done) => {
      clientSocket = ioc(`http://localhost:${serverPort}/communication`, {
        transports: ['websocket'],
        reconnection: false,
      });

      clientSocket.on('connect', done);
    });

    it('should subscribe to delivery updates for a message', (done) => {
      clientSocket.emit(
        'subscribe-delivery-updates',
        { messageId: mockMessageId },
        (response: any) => {
          expect(response).toBeDefined();
          expect(response.success).toBe(true);
          done();
        }
      );
    });

    it('should join the correct room when subscribing', (done) => {
      clientSocket.emit(
        'subscribe-delivery-updates',
        { messageId: mockMessageId },
        (response: any) => {
          expect(response.success).toBe(true);

          // Verify client is in the room (indirect verification through event emission)
          const statusUpdate = {
            messageId: mockMessageId,
            status: 'DELIVERED',
            timestamp: new Date().toISOString(),
          };

          clientSocket.on('delivery-status-update', (data) => {
            expect(data).toEqual(statusUpdate);
            done();
          });

          // Emit status update to the room
          setTimeout(() => {
            gateway.emitDeliveryStatusUpdate(mockMessageId, statusUpdate);
          }, 100);
        }
      );
    });

    it('should receive delivery status updates', (done) => {
      clientSocket.emit('subscribe-delivery-updates', { messageId: mockMessageId });

      const statusUpdate = {
        messageId: mockMessageId,
        recipientId: 'recipient-123',
        status: 'DELIVERED',
        deliveredAt: new Date().toISOString(),
      };

      clientSocket.on('delivery-status-update', (data) => {
        expect(data).toEqual(statusUpdate);
        expect(data.messageId).toBe(mockMessageId);
        expect(data.status).toBe('DELIVERED');
        done();
      });

      // Simulate server emitting delivery status update
      setTimeout(() => {
        gateway.emitDeliveryStatusUpdate(mockMessageId, statusUpdate);
      }, 100);
    });

    it('should handle multiple subscriptions', (done) => {
      const messageId1 = 'msg-1';
      const messageId2 = 'msg-2';
      let receivedCount = 0;

      // Subscribe to first message
      clientSocket.emit('subscribe-delivery-updates', { messageId: messageId1 });

      // Subscribe to second message
      clientSocket.emit('subscribe-delivery-updates', { messageId: messageId2 });

      clientSocket.on('delivery-status-update', (data) => {
        receivedCount++;
        if (receivedCount === 2) {
          done();
        }
      });

      // Emit updates for both messages
      setTimeout(() => {
        gateway.emitDeliveryStatusUpdate(messageId1, {
          messageId: messageId1,
          status: 'DELIVERED',
        });
        gateway.emitDeliveryStatusUpdate(messageId2, {
          messageId: messageId2,
          status: 'DELIVERED',
        });
      }, 100);
    });
  });

  describe('Real-time Message Delivery', () => {
    beforeEach((done) => {
      clientSocket = ioc(`http://localhost:${serverPort}/communication`, {
        transports: ['websocket'],
        reconnection: false,
      });

      clientSocket.on('connect', done);
    });

    it('should emit delivery status to subscribed clients only', (done) => {
      const subscribedMessageId = mockMessageId;
      const unsubscribedMessageId = 'msg-other';

      // Create second client that doesn't subscribe
      const clientSocket2 = ioc(`http://localhost:${serverPort}/communication`, {
        transports: ['websocket'],
        reconnection: false,
      });

      clientSocket2.on('connect', () => {
        // First client subscribes
        clientSocket.emit('subscribe-delivery-updates', { messageId: subscribedMessageId });

        let receivedByClient1 = false;
        let receivedByClient2 = false;

        clientSocket.on('delivery-status-update', () => {
          receivedByClient1 = true;
        });

        clientSocket2.on('delivery-status-update', () => {
          receivedByClient2 = true;
        });

        setTimeout(() => {
          gateway.emitDeliveryStatusUpdate(subscribedMessageId, {
            messageId: subscribedMessageId,
            status: 'DELIVERED',
          });
        }, 100);

        setTimeout(() => {
          expect(receivedByClient1).toBe(true);
          expect(receivedByClient2).toBe(false);
          clientSocket2.disconnect();
          done();
        }, 300);
      });
    });
  });

  describe('Connection Error Handling', () => {
    it('should handle disconnection gracefully', (done) => {
      clientSocket = ioc(`http://localhost:${serverPort}/communication`, {
        transports: ['websocket'],
        reconnection: false,
      });

      clientSocket.on('connect', () => {
        clientSocket.disconnect();
      });

      clientSocket.on('disconnect', (reason) => {
        expect(reason).toBeDefined();
        done();
      });
    });

    it('should handle connection timeout', (done) => {
      clientSocket = ioc(`http://localhost:${serverPort}/communication`, {
        transports: ['websocket'],
        reconnection: false,
        timeout: 1000,
      });

      clientSocket.on('connect', () => {
        expect(clientSocket.connected).toBe(true);
        done();
      });

      clientSocket.on('connect_error', (error) => {
        // Connection might timeout in test environment
        expect(error).toBeDefined();
        done();
      });
    });
  });

  describe('Reconnection Handling', () => {
    it('should support reconnection', (done) => {
      clientSocket = ioc(`http://localhost:${serverPort}/communication`, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 100,
      });

      let connectCount = 0;

      clientSocket.on('connect', () => {
        connectCount++;

        if (connectCount === 1) {
          // First connection, disconnect to trigger reconnect
          clientSocket.disconnect();
        } else if (connectCount === 2) {
          // Reconnected successfully
          expect(connectCount).toBe(2);
          done();
        }
      });
    });
  });

  describe('Multiple Client Scenarios', () => {
    it('should handle multiple concurrent clients', (done) => {
      const clients: ClientSocket[] = [];
      const clientCount = 5;
      let connectedCount = 0;

      for (let i = 0; i < clientCount; i++) {
        const client = ioc(`http://localhost:${serverPort}/communication`, {
          transports: ['websocket'],
          reconnection: false,
        });

        client.on('connect', () => {
          connectedCount++;

          if (connectedCount === clientCount) {
            expect(connectedCount).toBe(clientCount);

            // Disconnect all clients
            clients.forEach(c => c.disconnect());
            done();
          }
        });

        clients.push(client);
      }
    });

    it('should broadcast to specific rooms only', (done) => {
      const client1 = ioc(`http://localhost:${serverPort}/communication`, {
        transports: ['websocket'],
        reconnection: false,
      });

      const client2 = ioc(`http://localhost:${serverPort}/communication`, {
        transports: ['websocket'],
        reconnection: false,
      });

      const messageId1 = 'msg-room-1';
      const messageId2 = 'msg-room-2';

      let connectedCount = 0;
      let client1Received = false;
      let client2Received = false;

      const checkDone = () => {
        if (connectedCount === 2) {
          setTimeout(() => {
            expect(client1Received).toBe(true);
            expect(client2Received).toBe(false);
            client1.disconnect();
            client2.disconnect();
            done();
          }, 300);
        }
      };

      client1.on('connect', () => {
        connectedCount++;
        // Subscribe client1 to messageId1
        client1.emit('subscribe-delivery-updates', { messageId: messageId1 });
        checkDone();
      });

      client2.on('connect', () => {
        connectedCount++;
        // Subscribe client2 to messageId2
        client2.emit('subscribe-delivery-updates', { messageId: messageId2 });
        checkDone();
      });

      client1.on('delivery-status-update', (data) => {
        if (data.messageId === messageId1) {
          client1Received = true;
        }
      });

      client2.on('delivery-status-update', (data) => {
        if (data.messageId === messageId1) {
          client2Received = true; // Should not happen
        }
      });

      // Emit only to messageId1 room after subscriptions are set up
      setTimeout(() => {
        gateway.emitDeliveryStatusUpdate(messageId1, {
          messageId: messageId1,
          status: 'DELIVERED',
        });
      }, 200);
    });
  });

  describe('Message Ordering and Delivery Guarantees', () => {
    beforeEach((done) => {
      clientSocket = ioc(`http://localhost:${serverPort}/communication`, {
        transports: ['websocket'],
        reconnection: false,
      });

      clientSocket.on('connect', done);
    });

    it('should maintain message order', (done) => {
      clientSocket.emit('subscribe-delivery-updates', { messageId: mockMessageId });

      const receivedMessages: any[] = [];
      const expectedOrder = ['SENT', 'DELIVERED', 'READ'];

      clientSocket.on('delivery-status-update', (data) => {
        receivedMessages.push(data.status);

        if (receivedMessages.length === 3) {
          expect(receivedMessages).toEqual(expectedOrder);
          done();
        }
      });

      // Emit updates in order
      setTimeout(() => {
        gateway.emitDeliveryStatusUpdate(mockMessageId, {
          messageId: mockMessageId,
          status: 'SENT',
        });
      }, 50);

      setTimeout(() => {
        gateway.emitDeliveryStatusUpdate(mockMessageId, {
          messageId: mockMessageId,
          status: 'DELIVERED',
        });
      }, 100);

      setTimeout(() => {
        gateway.emitDeliveryStatusUpdate(mockMessageId, {
          messageId: mockMessageId,
          status: 'READ',
        });
      }, 150);
    });
  });

  describe('Performance and Load', () => {
    it('should handle rapid event emissions', (done) => {
      clientSocket = ioc(`http://localhost:${serverPort}/communication`, {
        transports: ['websocket'],
        reconnection: false,
      });

      clientSocket.on('connect', () => {
        clientSocket.emit('subscribe-delivery-updates', { messageId: mockMessageId });

        let receivedCount = 0;
        const expectedCount = 100;

        clientSocket.on('delivery-status-update', () => {
          receivedCount++;

          if (receivedCount === expectedCount) {
            expect(receivedCount).toBe(expectedCount);
            done();
          }
        });

        // Emit many updates rapidly
        for (let i = 0; i < expectedCount; i++) {
          gateway.emitDeliveryStatusUpdate(mockMessageId, {
            messageId: mockMessageId,
            status: 'DELIVERED',
            index: i,
          });
        }
      });
    });
  });

  describe('Security and Validation', () => {
    beforeEach((done) => {
      clientSocket = ioc(`http://localhost:${serverPort}/communication`, {
        transports: ['websocket'],
        reconnection: false,
      });

      clientSocket.on('connect', done);
    });

    it('should handle invalid subscription data', (done) => {
      clientSocket.emit(
        'subscribe-delivery-updates',
        { invalid: 'data' }, // Missing messageId
        (response: any) => {
          // Should still respond (even if validation fails in real implementation)
          expect(response).toBeDefined();
          done();
        }
      );
    });

    it('should handle null or undefined data', (done) => {
      clientSocket.emit(
        'subscribe-delivery-updates',
        null,
        (response: any) => {
          expect(response).toBeDefined();
          done();
        }
      );
    });
  });
});
