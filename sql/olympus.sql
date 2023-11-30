CREATE DATABASE IF NOT EXISTS olympus;

USE olympus;

CREATE TABLE IF NOT EXISTS event_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL UNIQUE ,
    INDEX idx_event_name (name)
);

CREATE TABLE IF NOT EXISTS sports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL UNIQUE ,
    "desc" VARCHAR NOT NULL,
    players INT NOT NULL,
    INDEX idx_sport_name (name)
);


CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    country VARCHAR NOT NULL,
    dob DATE CHECK (dob <= CURRENT_DATE ),
    sex CHAR(1) CHECK (sex IN ('M', 'F')),
    height INT NOT NULL, /* height in cm */
    sport_id uuid REFERENCES sports(id),
    INDEX idx_player_name (name)
);

CREATE TABLE IF NOT EXISTS streams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stream_url VARCHAR NOT NULL,
    privacy varchar NOT NULL DEFAULT ('public'),
    views INT NOT NULL DEFAULT (0),
    start_time TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_views_gt_zero CHECK (views >= 0)
);

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type uuid REFERENCES event_types(id),
    stream_id uuid REFERENCES streams(id),
    sport_id uuid REFERENCES sports(id),
    location VARCHAR NOT NULL,
    date DATE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email varchar NOT NULL ,
    stream_id uuid REFERENCES streams(id),
    liked_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_comment_id uuid REFERENCES comments(id),
    email varchar NOT NULL ,
    stream_id uuid REFERENCES streams(id),
    content VARCHAR NOT NULL,
    commented_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS players_in_event(
    event_id UUID references events(id),
    player_id UUID references players(id),
    PRIMARY KEY (event_id, player_id)
);

INSERT INTO event_types (name) VALUES ('Olympic'), ('Paralympic'), ('Exhibition'), ('All-Star'), ('Invitational')
ON CONFLICT (name) DO UPDATE SET name = excluded.name;

