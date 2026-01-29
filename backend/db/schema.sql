CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO roles (role_name) VALUES ('candidate'),('interviewer');

CREATE TABLE IF NOT EXISTS user_roles(
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id),
    PRIMARY KEY(role_id,user_id)
);

CREATE TABLE IF NOT EXISTS interviews(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) CHECK( status IN ('scheduled','completed','expired')) DEFAULT 'scheduled',
    stream_call_id VARCHAR(200) NOT NULL,
    created_by UUID references users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interview_participants(
    interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) CHECK(role IN ('candidate','interviewer'))
);

CREATE TABLE IF NOT EXISTS recordings(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE,
    recording_url TEXT NOT NULL,
    stream_recording_id VARCHAR(150),
    created_by UUID REFERENCES users(id)
);