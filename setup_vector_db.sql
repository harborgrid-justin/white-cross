-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create table for storing file information and code headers
CREATE TABLE IF NOT EXISTS code_files (
    id SERIAL PRIMARY KEY,
    file_path VARCHAR(500) NOT NULL UNIQUE,
    file_type VARCHAR(50),
    file_size INTEGER,
    last_modified TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for storing code headers with their metadata
CREATE TABLE IF NOT EXISTS code_headers (
    id SERIAL PRIMARY KEY,
    file_id INTEGER REFERENCES code_files(id) ON DELETE CASCADE,
    header_type VARCHAR(100) NOT NULL, -- e.g., 'function', 'class', 'interface', 'component'
    header_name VARCHAR(200) NOT NULL,
    header_content TEXT NOT NULL,
    line_number INTEGER,
    start_line INTEGER,
    end_line INTEGER,
    complexity_score INTEGER DEFAULT 0,
    dependency_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for storing vector embeddings of code headers
CREATE TABLE IF NOT EXISTS code_embeddings (
    id SERIAL PRIMARY KEY,
    header_id INTEGER REFERENCES code_headers(id) ON DELETE CASCADE,
    embedding VECTOR(1536), -- OpenAI ada-002 embedding dimension
    embedding_model VARCHAR(100) DEFAULT 'text-embedding-ada-002',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(header_id)
);

-- Create table for storing semantic relationships between code headers
CREATE TABLE IF NOT EXISTS code_relationships (
    id SERIAL PRIMARY KEY,
    source_header_id INTEGER REFERENCES code_headers(id) ON DELETE CASCADE,
    target_header_id INTEGER REFERENCES code_headers(id) ON DELETE CASCADE,
    relationship_type VARCHAR(100) NOT NULL, -- e.g., 'imports', 'calls', 'extends', 'implements', 'uses'
    similarity_score FLOAT,
    confidence_score FLOAT DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source_header_id, target_header_id, relationship_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_code_files_path ON code_files(file_path);
CREATE INDEX IF NOT EXISTS idx_code_headers_file_id ON code_headers(file_id);
CREATE INDEX IF NOT EXISTS idx_code_headers_type ON code_headers(header_type);
CREATE INDEX IF NOT EXISTS idx_code_headers_name ON code_headers(header_name);
CREATE INDEX IF NOT EXISTS idx_code_embeddings_header_id ON code_embeddings(header_id);
CREATE INDEX IF NOT EXISTS idx_code_relationships_source ON code_relationships(source_header_id);
CREATE INDEX IF NOT EXISTS idx_code_relationships_target ON code_relationships(target_header_id);
CREATE INDEX IF NOT EXISTS idx_code_relationships_type ON code_relationships(relationship_type);

-- Create HNSW index for vector similarity search (cosine distance)
CREATE INDEX IF NOT EXISTS idx_code_embeddings_vector 
ON code_embeddings 
USING hnsw (embedding vector_cosine_ops);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at columns
CREATE TRIGGER update_code_files_updated_at 
    BEFORE UPDATE ON code_files 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_code_headers_updated_at 
    BEFORE UPDATE ON code_headers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function for semantic similarity search
CREATE OR REPLACE FUNCTION find_similar_code(
    query_embedding VECTOR(1536),
    similarity_threshold FLOAT DEFAULT 0.7,
    max_results INTEGER DEFAULT 10
)
RETURNS TABLE(
    header_id INTEGER,
    file_path VARCHAR(500),
    header_name VARCHAR(200),
    header_type VARCHAR(100),
    header_content TEXT,
    similarity_score FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ch.id,
        cf.file_path,
        ch.header_name,
        ch.header_type,
        ch.header_content,
        1 - (ce.embedding <=> query_embedding) AS similarity_score
    FROM code_embeddings ce
    JOIN code_headers ch ON ce.header_id = ch.id
    JOIN code_files cf ON ch.file_id = cf.id
    WHERE 1 - (ce.embedding <=> query_embedding) >= similarity_threshold
    ORDER BY ce.embedding <=> query_embedding
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Create function to get related code headers
CREATE OR REPLACE FUNCTION get_related_code(
    source_header_id INTEGER,
    relationship_types VARCHAR[] DEFAULT ARRAY['imports', 'calls', 'extends', 'implements', 'uses']
)
RETURNS TABLE(
    target_header_id INTEGER,
    file_path VARCHAR(500),
    header_name VARCHAR(200),
    header_type VARCHAR(100),
    relationship_type VARCHAR(100),
    similarity_score FLOAT,
    confidence_score FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cr.target_header_id,
        cf.file_path,
        ch.header_name,
        ch.header_type,
        cr.relationship_type,
        cr.similarity_score,
        cr.confidence_score
    FROM code_relationships cr
    JOIN code_headers ch ON cr.target_header_id = ch.id
    JOIN code_files cf ON ch.file_id = cf.id
    WHERE cr.source_header_id = source_header_id
    AND cr.relationship_type = ANY(relationship_types)
    ORDER BY cr.confidence_score DESC, cr.similarity_score DESC;
END;
$$ LANGUAGE plpgsql;

-- Create view for comprehensive code analysis
CREATE OR REPLACE VIEW code_analysis_view AS
SELECT 
    cf.id as file_id,
    cf.file_path,
    cf.file_type,
    ch.id as header_id,
    ch.header_name,
    ch.header_type,
    ch.complexity_score,
    ch.dependency_count,
    ch.line_number,
    CASE WHEN ce.id IS NOT NULL THEN true ELSE false END as has_embedding,
    ce.embedding_model,
    COUNT(cr_out.id) as outgoing_relationships,
    COUNT(cr_in.id) as incoming_relationships
FROM code_files cf
LEFT JOIN code_headers ch ON cf.id = ch.file_id
LEFT JOIN code_embeddings ce ON ch.id = ce.header_id
LEFT JOIN code_relationships cr_out ON ch.id = cr_out.source_header_id
LEFT JOIN code_relationships cr_in ON ch.id = cr_in.target_header_id
GROUP BY cf.id, cf.file_path, cf.file_type, ch.id, ch.header_name, 
         ch.header_type, ch.complexity_score, ch.dependency_count, 
         ch.line_number, ce.id, ce.embedding_model;

-- Insert initial metadata about the database setup
INSERT INTO code_files (file_path, file_type, file_size, last_modified) 
VALUES ('_database_metadata', 'metadata', 0, CURRENT_TIMESTAMP)
ON CONFLICT (file_path) DO NOTHING;

INSERT INTO code_headers (file_id, header_type, header_name, header_content, line_number)
SELECT id, 'metadata', 'vector_database_setup', 
       'Vector database initialized for white-cross project with pgvector extension and semantic search capabilities', 1
FROM code_files WHERE file_path = '_database_metadata'
ON CONFLICT DO NOTHING;
