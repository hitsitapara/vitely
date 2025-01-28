CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO categories (name) VALUES ('Conference'), ('Workshop'), ('Meetup'), ('Webinar');

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  starttime TIMESTAMP NOT NULL,
  endtime TIMESTAMP NOT NULL,
);


CREATE TABLE event_categories (
  id SERIAL PRIMARY KEY,
  event_id INT REFERENCES events(id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(id) ON DELETE CASCADE
);
