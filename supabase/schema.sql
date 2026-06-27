CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies
CREATE TABLE companies (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  description   TEXT,
  category      TEXT NOT NULL,
  funding_total BIGINT DEFAULT 0,
  employee_count INT,
  founded_year  INT,
  hq_city       TEXT,
  hq_country    TEXT,
  logo_url      TEXT,
  website       TEXT,
  stage         TEXT,
  is_unicorn    BOOLEAN DEFAULT FALSE,
  valuation     BIGINT,
  growth_score  NUMERIC(5,2) DEFAULT 0,
  trending_score NUMERIC(10,4) DEFAULT 0,
  view_count    INT DEFAULT 0,
  tags          TEXT[] DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_companies_category      ON companies(category);
CREATE INDEX idx_companies_stage         ON companies(stage);
CREATE INDEX idx_companies_trending      ON companies(trending_score DESC);
CREATE INDEX idx_companies_slug          ON companies(slug);

-- Investors
CREATE TABLE investors (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  type            TEXT,
  bio             TEXT,
  aum             BIGINT,
  portfolio_count INT DEFAULT 0,
  stage_focus     TEXT[] DEFAULT '{}',
  sector_focus    TEXT[] DEFAULT '{}',
  location        TEXT,
  logo_url        TEXT,
  avg_check_size  BIGINT,
  website         TEXT,
  investment_thesis TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_investors_slug ON investors(slug);
CREATE INDEX idx_investors_type ON investors(type);

-- Founders
CREATE TABLE founders (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  title      TEXT,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  bio        TEXT,
  twitter    TEXT,
  linkedin   TEXT,
  photo_url  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_founders_company ON founders(company_id);

-- Funding Rounds
CREATE TABLE funding_rounds (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id         UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  round_type         TEXT NOT NULL,
  amount             BIGINT,
  currency           TEXT DEFAULT 'USD',
  date               DATE,
  lead_investor_id   UUID REFERENCES investors(id) ON DELETE SET NULL,
  lead_investor_name TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_funding_company ON funding_rounds(company_id);
CREATE INDEX idx_funding_date    ON funding_rounds(date DESC);

-- Investor Portfolio (junction)
CREATE TABLE investor_portfolio (
  investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
  company_id  UUID REFERENCES companies(id) ON DELETE CASCADE,
  round_type  TEXT,
  invested_at DATE,
  is_lead     BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (investor_id, company_id)
);
CREATE INDEX idx_portfolio_investor ON investor_portfolio(investor_id);
CREATE INDEX idx_portfolio_company  ON investor_portfolio(company_id);

-- Products
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  category    TEXT,
  upvotes     INT DEFAULT 0,
  logo_url    TEXT,
  website_url TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_products_company ON products(company_id);
CREATE INDEX idx_products_upvotes ON products(upvotes DESC);

-- News Articles
CREATE TABLE news_articles (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  url          TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  source       TEXT,
  tag          TEXT,
  summary      TEXT,
  view_count   INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_news_published ON news_articles(published_at DESC);

-- News ↔ Companies
CREATE TABLE news_company_relations (
  news_article_id UUID REFERENCES news_articles(id) ON DELETE CASCADE,
  company_id      UUID REFERENCES companies(id) ON DELETE CASCADE,
  PRIMARY KEY (news_article_id, company_id)
);

-- Supporting tables for CompanyDetail
CREATE TABLE timeline_events (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  year       INT NOT NULL,
  label      TEXT NOT NULL,
  description TEXT
);

CREATE TABLE ownership_breakdown (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  owner_name TEXT NOT NULL,
  percentage NUMERIC(5,2) NOT NULL,
  color      TEXT
);

CREATE TABLE portfolio_concentration (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
  category    TEXT NOT NULL,
  percentage  NUMERIC(5,2) NOT NULL,
  color       TEXT
);

CREATE TABLE competitor_relations (
  company_id    UUID REFERENCES companies(id) ON DELETE CASCADE,
  competitor_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  PRIMARY KEY (company_id, competitor_id)
);

-- updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER companies_updated_at BEFORE UPDATE ON companies
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
