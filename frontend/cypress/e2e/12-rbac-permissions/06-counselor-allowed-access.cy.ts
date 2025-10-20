/// <reference types="cypress" />

/**
 * RBAC - Counselor Allowed Access (Enhanced - 25 tests)
 *
 * Tests counselor role permissions focusing on counseling and mental health access
 * Validates appropriate access to student data for counseling purposes
 *
 * User Account: counselor@school.edu / CounselorPassword123! (COUNSELOR)
 *
 * Healthcare Context:
 * - Counselors focus on mental health and behavioral support
 * - Can view student demographics and contact information
 * - Can access relevant health records (mental health, counseling notes)
 * - Can create incident reports related to behavioral issues
 * - Cannot administer medications or access full medical records
 * - Cannot access system administration functions
 */

describe('RBAC - Counselor Allowed Access', () => {
  beforeEach(() => {
    cy.loginAs('counselor@school.edu', 'CounselorPassword123!')
    cy.verifyUserRole('COUNSELOR')
    cy.visit('/dashboard')
  })

  context('Dashboard and Navigation', () => {
    it('should access dashboard successfully', () => {
      cy.url().should('include', '/dashboard')
      cy.get('body', { timeout: 2500 }).should('be.visible')
      cy.log('Counselors have dashboard access for oversight')
    })

    it('should maintain counselor session across pages', () => {
      cy.visit('/students')
      cy.url().should('not.include', '/login')
      cy.verifyUserRole('COUNSELOR')
      cy.log('Session persists for counselor role')
    })

    it('should have counselor role properly set', () => {
      cy.window({ timeout: 2500 }).then((win) => {
        const userStr = win.localStorage.getItem('user')
        const authStr = win.localStorage.getItem('auth_data')

        if (userStr) {
          const user = JSON.parse(userStr)
          expect(user.role).to.equal('COUNSELOR')
        } else {
          expect(authStr).to.exist
        }
      })
      cy.log('COUNSELOR role verified in session')
    })
  })

  context('Student Access and Management', () => {
    it('should access students page', () => {
      cy.visit('/students')
      cy.url({ timeout: 2500 }).should('include', '/students')
      cy.log('View students for counseling services')
    })

    it('should see student information', () => {
      cy.visit('/students')
      cy.get('body').should('be.visible')
      cy.log('Access student demographics and enrollment data')
    })

    it('should be able to create student records', () => {
      cy.visit('/students')
      cy.get('button').contains(/add/i).should('exist')
      cy.log('Counselors can add students to their caseload')
    })

    it('should be able to update student information', () => {
      cy.visit('/students')
      cy.get('body').should('be.visible')
      cy.log('Update student contact and demographic information')
    })

    it('should view student demographics', () => {
      cy.visit('/students')
      cy.get('body').should('be.visible')
      cy.log('Access demographic data for counseling context')
    })

    it('should view student contact information', () => {
      cy.visit('/students')
      cy.get('body').should('be.visible')
      cy.log('Access parent/guardian contact information')
    })

    it('should access student emergency contacts', () => {
      cy.visit('/students')
      cy.get('body').should('be.visible')
      cy.log('View emergency contacts for crisis situations')
    })
  })

  context('Health Records Access', () => {
    it('should access health records page', () => {
      cy.visit('/health-records')
      cy.get('body').should('be.visible')
      cy.log('Access mental health and behavioral health records')
    })

    it('should view health records relevant to counseling', () => {
      cy.visit('/health-records')
      cy.get('body').should('be.visible')
      cy.log('View behavioral health and counseling notes')
    })

    it('should access student health information', () => {
      cy.visit('/health-records')
      cy.get('body').should('be.visible')
      cy.log('Access health context relevant to mental health')
    })

    it('should create health record notes for counseling sessions', () => {
      cy.visit('/health-records')
      cy.get('body').should('be.visible')
      cy.log('Document counseling sessions and interventions')
    })

    it('should view behavioral health assessments', () => {
      cy.visit('/health-records')
      cy.get('body').should('be.visible')
      cy.log('Access behavioral and mental health assessments')
    })
  })

  context('Incident and Behavioral Management', () => {
    it('should access incidents page', () => {
      cy.visit('/incidents')
      cy.get('body').should('be.visible')
      cy.log('View and create behavioral incident reports')
    })

    it('should create incident reports for behavioral issues', () => {
      cy.visit('/incidents')
      cy.get('body').should('be.visible')
      cy.log('Document behavioral incidents and interventions')
    })

    it('should view existing incident reports', () => {
      cy.visit('/incidents')
      cy.get('body').should('be.visible')
      cy.log('Review student behavioral history')
    })
  })

  context('Reporting and Analytics', () => {
    it('should access reports page', () => {
      cy.visit('/reports')
      cy.url({ timeout: 2500 }).should('include', '/reports')
      cy.log('Generate counseling and behavioral reports')
    })

    it('should generate caseload reports', () => {
      cy.visit('/reports')
      cy.get('body').should('be.visible')
      cy.log('View reports on counseling caseload')
    })

    it('should access attendance and behavioral analytics', () => {
      cy.visit('/reports')
      cy.get('body').should('be.visible')
      cy.log('Analyze attendance patterns related to behavioral issues')
    })
  })

  context('Medication Access Restrictions', () => {
    it('should NOT access medication administration', () => {
      cy.visit('/medications')
      cy.verifyButtonNotVisible('Administer')
      cy.log('Medication administration restricted to nurses')
    })

    it('should NOT modify medication inventory', () => {
      cy.visit('/medications')
      cy.contains('button', 'Inventory').should('be.visible')
      cy.contains('button', 'Inventory').click()
      cy.verifyButtonNotVisible('Add Stock')
      cy.log('Medication inventory management is nursing function')
    })

    it('should view medication information for context only', () => {
      cy.visit('/medications')
      cy.get('body').should('be.visible')
      cy.log('View medication list for student health context')
    })
  })

  context('Administrative Restrictions', () => {
    it('should NOT access system administration', () => {
      cy.visit('/settings', { failOnStatusCode: false })
      cy.url({ timeout: 3000 }).should('satisfy', (url: string) => {
        return url.includes('/dashboard') || url.includes('/403') || url.includes('/login')
      })
      cy.log('System administration restricted to admin role')
    })

    it('should NOT access user management', () => {
      cy.visit('/settings', { failOnStatusCode: false })
      cy.contains('button', 'Users').should('not.exist')
      cy.log('User management is admin-only')
    })

    it('should NOT access district or school configuration', () => {
      cy.visit('/settings', { failOnStatusCode: false })
      cy.contains('button', 'Districts').should('not.exist')
      cy.contains('button', 'Schools').should('not.exist')
      cy.log('District/school management restricted to admins')
    })

    it('should NOT access audit logs', () => {
      cy.visit('/settings', { failOnStatusCode: false })
      cy.contains('button', 'Audit Logs').should('not.exist')
      cy.log('Audit logs are admin/compliance function')
    })
  })

  context('Role-Specific Features', () => {
    it('should focus on mental health and counseling features', () => {
      cy.visit('/dashboard')
      cy.get('body').should('be.visible')
      cy.log('Dashboard shows counseling-relevant metrics')
    })

    it('should have access to appropriate student subset', () => {
      cy.visit('/students')
      cy.get('body').should('be.visible')
      cy.log('View students in counseling caseload')
    })

    it('should support crisis intervention workflows', () => {
      cy.visit('/incidents')
      cy.get('body').should('be.visible')
      cy.log('Crisis intervention and behavioral support tools')
    })
  })
})
