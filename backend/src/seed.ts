import { supabase } from './config/db';

const COMPANIES = [
  { name: 'OpenAI', slug: 'openai', category: 'Foundation Models', description: 'AI research and deployment company behind ChatGPT.', funding_total: 13000000000, employee_count: 1200, founded_year: 2015, hq_city: 'San Francisco', hq_country: 'USA', logo_url: 'https://logo.clearbit.com/openai.com', website: 'https://openai.com', stage: 'Growth', is_unicorn: true, valuation: 86000000000, growth_score: 95, trending_score: 99, view_count: 52000, tags: ['Generative AI', 'LLMs', 'GPT'] },
  { name: 'Anthropic', slug: 'anthropic', category: 'Foundation Models', description: 'AI safety and research company, creator of Claude.', funding_total: 7300000000, employee_count: 500, founded_year: 2021, hq_city: 'San Francisco', hq_country: 'USA', logo_url: 'https://logo.clearbit.com/anthropic.com', website: 'https://anthropic.com', stage: 'Growth', is_unicorn: true, valuation: 18400000000, growth_score: 92, trending_score: 94, view_count: 24000, tags: ['Safety', 'Claude', 'LLMs'] },
  { name: 'Cursor', slug: 'cursor', category: 'AI Coding', description: 'An AI-powered code editor built on top of VS Code.', funding_total: 8000000, employee_count: 20, founded_year: 2022, hq_city: 'San Francisco', hq_country: 'USA', logo_url: 'https://logo.clearbit.com/cursor.sh', website: 'https://cursor.sh', stage: 'Series A', is_unicorn: false, valuation: null, growth_score: 98, trending_score: 98, view_count: 45000, tags: ['Developer Tools', 'IDE', 'Coding'] },
  { name: 'Perplexity', slug: 'perplexity', category: 'AI Search', description: 'AI-powered conversational search engine providing direct answers.', funding_total: 165000000, employee_count: 80, founded_year: 2022, hq_city: 'San Francisco', hq_country: 'USA', logo_url: 'https://logo.clearbit.com/perplexity.ai', website: 'https://perplexity.ai', stage: 'Series B', is_unicorn: true, valuation: 1040000000, growth_score: 94, trending_score: 97, view_count: 31000, tags: ['Search', 'Information Retrieval', 'Answer Engine'] },
  { name: 'Midjourney', slug: 'midjourney', category: 'AI Video', description: 'Independent research lab exploring new mediums of thought and expanding imaginative powers.', funding_total: 0, employee_count: 40, founded_year: 2021, hq_city: 'San Francisco', hq_country: 'USA', logo_url: 'https://logo.clearbit.com/midjourney.com', website: 'https://midjourney.com', stage: 'Growth', is_unicorn: true, valuation: 10000000000, growth_score: 90, trending_score: 92, view_count: 28000, tags: ['Image Generation', 'Text-to-Image', 'Art'] },
  { name: 'ElevenLabs', slug: 'elevenlabs', category: 'AI Voice', description: 'Voice technology research company developing realistic text-to-speech software.', funding_total: 101000000, employee_count: 60, founded_year: 2022, hq_city: 'New York', hq_country: 'USA', logo_url: 'https://logo.clearbit.com/elevenlabs.io', website: 'https://elevenlabs.io', stage: 'Series B', is_unicorn: true, valuation: 1100000000, growth_score: 89, trending_score: 91, view_count: 19000, tags: ['Audio', 'Text-to-Speech', 'Cloning'] },
  { name: 'Runway', slug: 'runway', category: 'AI Video', description: 'Next-generation creative tools powered by artificial intelligence.', funding_total: 237000000, employee_count: 100, founded_year: 2018, hq_city: 'New York', hq_country: 'USA', logo_url: 'https://logo.clearbit.com/runwayml.com', website: 'https://runwayml.com', stage: 'Series C', is_unicorn: true, valuation: 1500000000, growth_score: 87, trending_score: 88, view_count: 15000, tags: ['Generative Video', 'Text-to-Video', 'Creative'] },
  { name: 'Mistral AI', slug: 'mistral-ai', category: 'Foundation Models', description: 'Open weights and commercial AI models developed in Europe.', funding_total: 640000000, employee_count: 60, founded_year: 2023, hq_city: 'Paris', hq_country: 'France', logo_url: 'https://logo.clearbit.com/mistral.ai', website: 'https://mistral.ai', stage: 'Series B', is_unicorn: true, valuation: 6000000000, growth_score: 91, trending_score: 93, view_count: 22000, tags: ['Open Source', 'LLMs', 'European AI'] },
  { name: 'Cohere', slug: 'cohere', category: 'Foundation Models', description: 'Enterprise AI platform providing industry-leading LLMs.', funding_total: 445000000, employee_count: 250, founded_year: 2019, hq_city: 'Toronto', hq_country: 'Canada', logo_url: 'https://logo.clearbit.com/cohere.com', website: 'https://cohere.com', stage: 'Series C', is_unicorn: true, valuation: 2200000000, growth_score: 85, trending_score: 83, view_count: 11000, tags: ['Enterprise', 'LLMs', 'Embeddings'] },
  { name: 'Hugging Face', slug: 'hugging-face', category: 'AI Infrastructure', description: 'The platform where the machine learning community collaborates on models, datasets, and apps.', funding_total: 395000000, employee_count: 170, founded_year: 2016, hq_city: 'New York', hq_country: 'USA', logo_url: 'https://logo.clearbit.com/huggingface.co', website: 'https://huggingface.co', stage: 'Series D', is_unicorn: true, valuation: 4500000000, growth_score: 88, trending_score: 89, view_count: 36000, tags: ['Open Source', 'Machine Learning', 'Repository'] },
  { name: 'Pika', slug: 'pika', category: 'AI Video', description: 'An AI-powered video generator platform that brings ideas to life.', funding_total: 55000000, employee_count: 15, founded_year: 2023, hq_city: 'Palo Alto', hq_country: 'USA', logo_url: 'https://logo.clearbit.com/pika.art', website: 'https://pika.art', stage: 'Series A', is_unicorn: false, valuation: 250000000, growth_score: 82, trending_score: 85, view_count: 12000, tags: ['Text-to-Video', 'Creative', 'Animation'] },
  { name: 'Databricks', slug: 'databricks', category: 'AI Infrastructure', description: 'Data and AI platform for lakehouse architectures.', funding_total: 4000000000, employee_count: 6000, founded_year: 2013, hq_city: 'San Francisco', hq_country: 'USA', logo_url: 'https://logo.clearbit.com/databricks.com', website: 'https://databricks.com', stage: 'Growth', is_unicorn: true, valuation: 43000000000, growth_score: 86, trending_score: 87, view_count: 14000, tags: ['Data Engineering', 'Enterprise AI', 'Spark'] },
  { name: 'Glean', slug: 'glean', category: 'AI Search', description: 'Enterprise search and AI assistant for internal company knowledge.', funding_total: 360000000, employee_count: 450, founded_year: 2019, hq_city: 'Palo Alto', hq_country: 'USA', logo_url: 'https://logo.clearbit.com/glean.com', website: 'https://glean.com', stage: 'Series D', is_unicorn: true, valuation: 2200000000, growth_score: 87, trending_score: 89, view_count: 13000, tags: ['Enterprise Search', 'Internal Knowledge', 'RAG'] },
  { name: 'Harvey', slug: 'harvey', category: 'AI Agents', description: 'Generative AI platform designed specifically for professional legal work.', funding_total: 106000000, employee_count: 80, founded_year: 2022, hq_city: 'San Francisco', hq_country: 'USA', logo_url: 'https://logo.clearbit.com/harvey.ai', website: 'https://harvey.ai', stage: 'Series B', is_unicorn: false, valuation: 700000000, growth_score: 84, trending_score: 86, view_count: 10000, tags: ['Legal Tech', 'Copilot', 'Enterprise'] },
  { name: 'Luma AI', slug: 'luma-ai', category: 'AI Video', description: 'AI creative tools for capturing and generating realistic 3D and video.', funding_total: 70000000, employee_count: 35, founded_year: 2021, hq_city: 'Palo Alto', hq_country: 'USA', logo_url: 'https://logo.clearbit.com/lumalabs.ai', website: 'https://lumalabs.ai', stage: 'Series B', is_unicorn: false, valuation: 350000000, growth_score: 89, trending_score: 93, view_count: 16500, tags: ['3D Generation', 'Video Generation', 'NeRF'] },
  { name: 'Synthesia', slug: 'synthesia', category: 'AI Video', description: 'AI video generation platform using realistic synthetic avatars.', funding_total: 156000000, employee_count: 220, founded_year: 2017, hq_city: 'London', hq_country: 'UK', logo_url: 'https://logo.clearbit.com/synthesia.io', website: 'https://synthesia.io', stage: 'Series C', is_unicorn: true, valuation: 1000000000, growth_score: 80, trending_score: 81, view_count: 8500, tags: ['Synthetic Avatars', 'Video Creation', 'Enterprise'] },
  { name: 'Lovable', slug: 'lovable', category: 'AI Coding', description: 'AI software developer building production-grade web applications from descriptions.', funding_total: 5000000, employee_count: 10, founded_year: 2023, hq_city: 'Stockholm', hq_country: 'Sweden', logo_url: 'https://logo.clearbit.com/lovable.dev', website: 'https://lovable.dev', stage: 'Seed', is_unicorn: false, valuation: null, growth_score: 97, trending_score: 97, view_count: 18000, tags: ['App Builder', 'Coding Agents', 'No Code'] },
  { name: 'xAI', slug: 'xai', category: 'Foundation Models', description: 'AI research company founded by Elon Musk, creator of Grok.', funding_total: 6000000000, employee_count: 100, founded_year: 2023, hq_city: 'Palo Alto', hq_country: 'USA', logo_url: 'https://logo.clearbit.com/x.ai', website: 'https://x.ai', stage: 'Series B', is_unicorn: true, valuation: 24000000000, growth_score: 93, trending_score: 96, view_count: 29000, tags: ['Grok', 'LLMs', 'Elon Musk'] },
  { name: 'LangChain', slug: 'langchain', category: 'AI Infrastructure', description: 'Framework for building applications with large language models.', funding_total: 25000000, employee_count: 30, founded_year: 2022, hq_city: 'San Francisco', hq_country: 'USA', logo_url: 'https://logo.clearbit.com/langchain.com', website: 'https://langchain.com', stage: 'Series A', is_unicorn: false, valuation: 200000000, growth_score: 92, trending_score: 91, view_count: 25000, tags: ['Framework', 'Orchestration', 'RAG'] },
  { name: 'Pinecone', slug: 'pinecone', category: 'AI Infrastructure', description: 'Fully managed vector database for fast, accurate AI search.', funding_total: 138000000, employee_count: 120, founded_year: 2019, hq_city: 'New York', hq_country: 'USA', logo_url: 'https://logo.clearbit.com/pinecone.io', website: 'https://pinecone.io', stage: 'Series B', is_unicorn: true, valuation: 750000000, growth_score: 84, trending_score: 83, view_count: 9800, tags: ['Vector DB', 'RAG', 'Database'] },
  { name: 'Notion AI', slug: 'notion-ai', category: 'AI Agents', description: 'AI workspace tools integrated directly within the Notion product.', funding_total: 343000000, employee_count: 600, founded_year: 2013, hq_city: 'San Francisco', hq_country: 'USA', logo_url: 'https://logo.clearbit.com/notion.so', website: 'https://notion.so', stage: 'Growth', is_unicorn: true, valuation: 10000000000, growth_score: 83, trending_score: 84, view_count: 12000, tags: ['Productivity', 'Workspace', 'Note-Taking'] },
  { name: 'Canva AI', slug: 'canva-ai', category: 'AI Video', description: 'AI-powered design suite tools created by Canva.', funding_total: 572000000, employee_count: 4000, founded_year: 2013, hq_city: 'Sydney', hq_country: 'Australia', logo_url: 'https://logo.clearbit.com/canva.com', website: 'https://canva.com', stage: 'Growth', is_unicorn: true, valuation: 26000000000, growth_score: 81, trending_score: 82, view_count: 6700, tags: ['Design', 'Creative', 'Images'] },
  { name: 'Descript', slug: 'descript', category: 'AI Voice', description: 'AI-powered audio and video editing platform using transcripts.', funding_total: 100000000, employee_count: 150, founded_year: 2017, hq_city: 'San Francisco', hq_country: 'USA', logo_url: 'https://logo.clearbit.com/descript.com', website: 'https://descript.com', stage: 'Series C', is_unicorn: false, valuation: null, growth_score: 79, trending_score: 78, view_count: 5400, tags: ['Audio Editing', 'Transcribing', 'Video Editing'] },
  { name: 'Replit', slug: 'replit', category: 'AI Coding', description: 'Collaborative cloud-based coding platform with Replit Agent.', funding_total: 200000000, employee_count: 110, founded_year: 2016, hq_city: 'San Francisco', hq_country: 'USA', logo_url: 'https://logo.clearbit.com/replit.com', website: 'https://replit.com', stage: 'Series B', is_unicorn: true, valuation: 1160000000, growth_score: 88, trending_score: 89, view_count: 17800, tags: ['Cloud IDE', 'Deployment', 'Coding Agents'] },
  { name: 'Scale AI', slug: 'scale-ai', category: 'AI Infrastructure', description: 'Data annotation platform for labeling AI models training data.', funding_total: 1600000000, employee_count: 800, founded_year: 2016, hq_city: 'San Francisco', hq_country: 'USA', logo_url: 'https://logo.clearbit.com/scale.com', website: 'https://scale.com', stage: 'Growth', is_unicorn: true, valuation: 13800000000, growth_score: 90, trending_score: 93, view_count: 14500, tags: ['Data Labeling', 'RLHF', 'Training Data'] }
];

const INVESTORS = [
  { name: 'a16z', slug: 'a16z', type: 'VC', bio: 'Andreessen Horowitz backs bold founders building the future.', aum: 35000000000, portfolio_count: 500, stage_focus: ['Seed', 'Series A', 'Series B', 'Growth'], sector_focus: ['AI Infrastructure', 'AI Coding', 'Foundation Models'], location: 'Menlo Park, CA', logo_url: 'https://logo.clearbit.com/a16z.com', avg_check_size: 15000000, website: 'https://a16z.com', investment_thesis: 'Software is eating the world, and AI is programming the software.' },
  { name: 'Sequoia Capital', slug: 'sequoia-capital', type: 'VC', bio: 'We help the daring build legendary companies.', aum: 85000000000, portfolio_count: 1000, stage_focus: ['Seed', 'Series A', 'Series B', 'Growth'], sector_focus: ['AI Agents', 'AI Coding', 'Foundation Models'], location: 'Menlo Park, CA', logo_url: 'https://logo.clearbit.com/sequoiacap.com', avg_check_size: 20000000, website: 'https://sequoiacap.com', investment_thesis: 'Backing founders who create new categories of enterprise value using intelligence layers.' },
  { name: 'Lightspeed', slug: 'lightspeed', type: 'VC', bio: 'Multi-stage venture capital firm focused on accelerating disruptive trends.', aum: 25000000000, portfolio_count: 400, stage_focus: ['Seed', 'Series A', 'Series B'], sector_focus: ['AI Agents', 'AI Video', 'Foundation Models'], location: 'Silicon Valley, CA', logo_url: 'https://logo.clearbit.com/lsvp.com', avg_check_size: 10000000, website: 'https://lsvp.com', investment_thesis: 'Investing in the application layers transforming workflows and creative processes.' },
  { name: 'Khosla Ventures', slug: 'khosla-ventures', type: 'VC', bio: 'Venture assistance for early stage technology startups.', aum: 15000000000, portfolio_count: 700, stage_focus: ['Seed', 'Series A', 'Series B'], sector_focus: ['Foundation Models', 'Healthcare AI', 'Robotics'], location: 'Menlo Park, CA', logo_url: 'https://logo.clearbit.com/khoslaventures.com', avg_check_size: 8000000, website: 'https://khoslaventures.com', investment_thesis: 'Backing science-driven companies with massive technological leverage.' },
  { name: 'Accel', slug: 'accel', type: 'VC', bio: 'Early and growth-stage venture capital firm.', aum: 18000000000, portfolio_count: 600, stage_focus: ['Seed', 'Series A', 'Series B', 'Growth'], sector_focus: ['AI Agents', 'AI Infrastructure', 'AI Search'], location: 'Palo Alto, CA', logo_url: 'https://logo.clearbit.com/accel.com', avg_check_size: 12000000, website: 'https://accel.com', investment_thesis: 'Backing platform-defining developer tools and secure enterprise SaaS.' },
  { name: 'General Catalyst', slug: 'general-catalyst', type: 'VC', bio: 'Investing in powerful ideas and long-term relationships.', aum: 22000000000, portfolio_count: 450, stage_focus: ['Seed', 'Series A', 'Series B', 'Growth'], sector_focus: ['AI Agents', 'Healthcare AI', 'Enterprise AI'], location: 'Cambridge, MA', logo_url: 'https://logo.clearbit.com/generalcatalyst.com', avg_check_size: 15000000, website: 'https://generalcatalyst.com', investment_thesis: 'Investing in systems of intelligence transforming traditional industries.' },
  { name: 'Y Combinator', slug: 'y-combinator', type: 'VC', bio: 'We help startups at their very earliest stage.', aum: null, portfolio_count: 4000, stage_focus: ['Pre-Seed', 'Seed'], sector_focus: ['AI Agents', 'AI Coding', 'Healthcare AI'], location: 'Mountain View, CA', logo_url: 'https://logo.clearbit.com/ycombinator.com', avg_check_size: 500000, website: 'https://ycombinator.com', investment_thesis: 'Accelerating early-stage founders with programmatic support and network.' },
  { name: 'Microsoft', slug: 'microsoft', type: 'Corporate', bio: 'Empowering every person and organization to achieve more.', aum: null, portfolio_count: 120, stage_focus: ['Series B', 'Series C', 'Growth'], sector_focus: ['Foundation Models', 'AI Coding', 'AI Search'], location: 'Redmond, WA', logo_url: 'https://logo.clearbit.com/microsoft.com', avg_check_size: 500000000, website: 'https://microsoft.com', investment_thesis: 'Integrating state-of-the-art foundation models with Azure cloud ecosystem.' },
  { name: 'Google Ventures', slug: 'google-ventures', type: 'Corporate', bio: 'GV provides venture capital funding to bold startups.', aum: 8000000000, portfolio_count: 350, stage_focus: ['Seed', 'Series A', 'Series B'], sector_focus: ['Foundation Models', 'Healthcare AI', 'Robotics'], location: 'Mountain View, CA', logo_url: 'https://logo.clearbit.com/gv.com', website: 'https://gv.com', avg_check_size: 10000000, investment_thesis: 'Backing next-generation computing architectures and biomedical innovations.' },
  { name: 'Kleiner Perkins', slug: 'kleiner-perkins', type: 'VC', bio: 'Partnering with founders from the garage to IPO.', aum: 12000000000, portfolio_count: 550, stage_focus: ['Seed', 'Series A', 'Series B'], sector_focus: ['AI Infrastructure', 'AI Coding', 'AI Search'], location: 'Menlo Park, CA', logo_url: 'https://logo.clearbit.com/kleinerperkins.com', avg_check_size: 14000000, website: 'https://kleinerperkins.com', investment_thesis: 'Partnering with generation-defining founders at the product-market fit inflection point.' }
];

async function seed() {
  console.log('🌱 Starting Supabase Seeding...');

  // 1. Clear previous relations to avoid foreign key blocks
  await supabase.from('competitor_relations').delete().neq('company_id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('portfolio_concentration').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('ownership_breakdown').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('timeline_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('news_company_relations').delete().neq('news_article_id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('news_articles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('investor_portfolio').delete().neq('investor_id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('funding_rounds').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('founders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('companies').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('investors').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 2. Insert Companies
  console.log('Inserting companies...');
  const { data: dbCompanies, error: compErr } = await supabase.from('companies').insert(COMPANIES).select();
  if (compErr || !dbCompanies) {
    console.error('Error seeding companies:', compErr);
    return;
  }
  console.log(`Inserted ${dbCompanies.length} companies.`);

  // 3. Insert Investors
  console.log('Inserting investors...');
  const { data: dbInvestors, error: invErr } = await supabase.from('investors').insert(INVESTORS).select();
  if (invErr || !dbInvestors) {
    console.error('Error seeding investors:', invErr);
    return;
  }
  console.log(`Inserted ${dbInvestors.length} investors.`);

  // Helper Maps for Lookups
  const companyMap = new Map(dbCompanies.map((c) => [c.slug, c.id]));
  const investorMap = new Map(dbInvestors.map((i) => [i.slug, i.id]));

  // 4. Insert Founders (1-2 per company)
  const foundersData = [];
  for (const c of dbCompanies) {
    if (c.slug === 'openai') {
      foundersData.push(
        { name: 'Sam Altman', slug: 'sam-altman', title: 'CEO', company_id: c.id, bio: 'CEO and co-founder of OpenAI.', twitter: 'samaltman', linkedin: 'sam-altman', photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80' },
        { name: 'Greg Brockman', slug: 'greg-brockman', title: 'President', company_id: c.id, bio: 'President and co-founder of OpenAI.', twitter: 'gdb', linkedin: 'gregbrockman', photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80' }
      );
    } else if (c.slug === 'anthropic') {
      foundersData.push(
        { name: 'Dario Amodei', slug: 'dario-amodei', title: 'CEO & Co-founder', company_id: c.id, bio: 'Co-founder and CEO of Anthropic, former VP of Research at OpenAI.', twitter: null, linkedin: 'dario-amodei', photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
        { name: 'Daniela Amodei', slug: 'daniela-amodei', title: 'President & Co-founder', company_id: c.id, bio: 'Co-founder and President of Anthropic.', twitter: null, linkedin: 'daniela-amodei', photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80' }
      );
    } else {
      foundersData.push({
        name: `${c.name} Founder`,
        slug: `${c.slug}-founder`,
        title: 'Founder & CEO',
        company_id: c.id,
        bio: `Co-founder of ${c.name}.`,
        twitter: null,
        linkedin: null,
        photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
      });
    }
  }
  console.log('Inserting founders...');
  const { error: fErr } = await supabase.from('founders').insert(foundersData);
  if (fErr) console.error('Error seeding founders:', fErr);

  // 5. Insert Products
  const productsData = [];
  for (const c of dbCompanies) {
    if (c.slug === 'openai') {
      productsData.push(
        { company_id: c.id, name: 'ChatGPT', slug: 'chatgpt', description: 'Conversational assistant powered by GPT-4o.', category: 'AI Assistant', upvotes: 45000, logo_url: 'https://logo.clearbit.com/openai.com', website_url: 'https://chatgpt.com' },
        { company_id: c.id, name: 'GPT-4o', slug: 'gpt-4o', description: 'Omni multimodal language model.', category: 'API Model', upvotes: 18000, logo_url: 'https://logo.clearbit.com/openai.com', website_url: 'https://platform.openai.com' },
        { company_id: c.id, name: 'Sora', slug: 'sora', description: 'Realistic video generation from text descriptions.', category: 'Creative Tools', upvotes: 29000, logo_url: 'https://logo.clearbit.com/openai.com', website_url: 'https://openai.com/sora' }
      );
    } else if (c.slug === 'cursor') {
      productsData.push(
        { company_id: c.id, name: 'Cursor Editor', slug: 'cursor-editor', description: 'Advanced fork of VS Code with deep LLM auto-complete integration.', category: 'Developer Tools', upvotes: 12000, logo_url: 'https://logo.clearbit.com/cursor.sh', website_url: 'https://cursor.sh' }
      );
    } else {
      productsData.push({
        company_id: c.id,
        name: `${c.name} Core`,
        slug: `${c.slug}-core`,
        description: `Core platform by ${c.name} tailored for ${c.category}.`,
        category: 'Software Solutions',
        upvotes: Math.floor(Math.random() * 2000) + 100,
        logo_url: c.logo_url,
        website_url: c.website
      });
    }
  }
  console.log('Inserting products...');
  const { error: pError } = await supabase.from('products').insert(productsData);
  if (pError) console.error('Error seeding products:', pError);

  // 6. Insert Funding Rounds
  console.log('Inserting funding rounds...');
  const fundingRounds = [];
  const ycombinatorId = investorMap.get('y-combinator');
  const a16zId = investorMap.get('a16z');
  const sequoiaId = investorMap.get('sequoia-capital');
  const microsoftId = investorMap.get('microsoft');
  const lightspeedId = investorMap.get('lightspeed');

  for (const c of dbCompanies) {
    if (c.slug === 'openai') {
      fundingRounds.push(
        { company_id: c.id, round_type: 'Seed', amount: 10000000, currency: 'USD', date: '2016-01-01', lead_investor_id: ycombinatorId, lead_investor_name: 'Y Combinator' },
        { company_id: c.id, round_type: 'Series A', amount: 100000000, currency: 'USD', date: '2019-07-22', lead_investor_id: microsoftId, lead_investor_name: 'Microsoft' },
        { company_id: c.id, round_type: 'Growth', amount: 1000000000, currency: 'USD', date: '2023-01-23', lead_investor_id: microsoftId, lead_investor_name: 'Microsoft' },
        { company_id: c.id, round_type: 'Growth', amount: 10000000000, currency: 'USD', date: '2025-02-15', lead_investor_id: microsoftId, lead_investor_name: 'Microsoft' }
      );
    } else if (c.slug === 'cursor') {
      fundingRounds.push(
        { company_id: c.id, round_type: 'Seed', amount: 2000000, currency: 'USD', date: '2022-09-01', lead_investor_id: ycombinatorId, lead_investor_name: 'Y Combinator' },
        { company_id: c.id, round_type: 'Series A', amount: 8000000, currency: 'USD', date: '2024-03-10', lead_investor_id: a16zId, lead_investor_name: 'a16z' }
      );
    } else {
      fundingRounds.push(
        { company_id: c.id, round_type: 'Seed', amount: 1500000, currency: 'USD', date: '2023-03-01', lead_investor_id: ycombinatorId, lead_investor_name: 'Y Combinator' },
        { company_id: c.id, round_type: 'Series A', amount: 15000000, currency: 'USD', date: '2024-06-15', lead_investor_id: sequoiaId || a16zId, lead_investor_name: sequoiaId ? 'Sequoia Capital' : 'a16z' }
      );
    }
  }
  const { data: dbRounds, error: rErr } = await supabase.from('funding_rounds').insert(fundingRounds).select();
  if (rErr) console.error('Error seeding funding rounds:', rErr);

  // 7. Insert Investor Portfolio (junction)
  if (dbRounds) {
    const portfolioData = [];
    for (const round of dbRounds) {
      if (round.lead_investor_id) {
        portfolioData.push({
          investor_id: round.lead_investor_id,
          company_id: round.company_id,
          round_type: round.round_type,
          invested_at: round.date,
          is_lead: true
        });
      }
    }
    // Also add some non-lead portfolio entries
    if (sequoiaId && companyMap.get('perplexity')) {
      portfolioData.push({ investor_id: sequoiaId, company_id: companyMap.get('perplexity')!, round_type: 'Series B', invested_at: '2024-01-05', is_lead: false });
    }
    if (a16zId && companyMap.get('perplexity')) {
      portfolioData.push({ investor_id: a16zId, company_id: companyMap.get('perplexity')!, round_type: 'Series B', invested_at: '2024-01-05', is_lead: false });
    }

    console.log('Inserting investor portfolios...');
    const { error: portErr } = await supabase.from('investor_portfolio').insert(portfolioData);
    if (portErr) console.error('Error seeding portfolio junction:', portErr);
  }

  // 8. Insert News Articles
  const newsData = [];
  const tags = ['Funding', 'Product Launch', 'Regulation', 'Partnership', 'Breakthrough'];
  const sources = ['TechCrunch', 'Bloomberg', 'The Information', 'VentureBeat', 'Reuters'];
  for (let i = 1; i <= 30; i++) {
    const pubDate = new Date();
    pubDate.setDate(pubDate.getDate() - i);
    newsData.push({
      title: `AI Breakthrough Event ${i}: Key Ecosystem updates and industry shifts`,
      url: `https://techcrunch.com/2026/06/${i}/ai-breakthrough-milestone`,
      published_at: pubDate.toISOString(),
      source: sources[i % sources.length],
      tag: tags[i % tags.length],
      summary: `A detailed analysis of how this event affects the AI market, infrastructure costs, and start-up evaluations.`,
      view_count: Math.floor(Math.random() * 5000) + 100
    });
  }
  console.log('Inserting news articles...');
  const { data: dbNews, error: nErr } = await supabase.from('news_articles').insert(newsData).select();
  if (nErr || !dbNews) {
    console.error('Error seeding news:', nErr);
  } else {
    // Connect news to companies (OpenAI & Anthropic)
    const newsRelations = [];
    const openaiId = companyMap.get('openai');
    const anthropicId = companyMap.get('anthropic');
    if (openaiId) newsRelations.push({ news_article_id: dbNews[0].id, company_id: openaiId });
    if (anthropicId) newsRelations.push({ news_article_id: dbNews[1].id, company_id: anthropicId });
    if (openaiId) newsRelations.push({ news_article_id: dbNews[2].id, company_id: openaiId });
    if (anthropicId) newsRelations.push({ news_article_id: dbNews[3].id, company_id: anthropicId });

    console.log('Linking news articles to companies...');
    const { error: relErr } = await supabase.from('news_company_relations').insert(newsRelations);
    if (relErr) console.error('Error linking news to companies:', relErr);
  }

  // 9. Supporting Data: Timeline, Ownership, Portfolio Concentration, Competitors
  const openaiId = companyMap.get('openai');
  if (openaiId) {
    console.log('Inserting OpenAI timeline and ownership...');
    await supabase.from('timeline_events').insert([
      { company_id: openaiId, year: 2015, label: 'Founded', description: 'OpenAI is founded as a non-profit AI research lab.' },
      { company_id: openaiId, year: 2019, label: 'GPT-2 Released', description: 'Releases GPT-2 language model, transitioning into capped-profit model.' },
      { company_id: openaiId, year: 2020, label: 'GPT-3 Launch', description: 'Launches GPT-3 language model API.' },
      { company_id: openaiId, year: 2022, label: 'ChatGPT Launch', description: 'Releases ChatGPT conversational interface, sparking industry-wide adoption.' },
      { company_id: openaiId, year: 2023, label: 'GPT-4 Launch', description: 'Launches GPT-4 multimodal model.' },
      { company_id: openaiId, year: 2024, label: 'Sora Unveiled', description: 'Showcases Sora text-to-video generative model.' },
      { company_id: openaiId, year: 2025, label: 'Operator Agents', description: 'Releases AI Agent capabilities under Operator project code.' }
    ]);

    await supabase.from('ownership_breakdown').insert([
      { company_id: openaiId, owner_name: 'Microsoft', percentage: 49.00, color: '#E53935' },
      { company_id: openaiId, owner_name: 'Venture Investors', percentage: 21.00, color: '#6B7280' },
      { company_id: openaiId, owner_name: 'Employees', percentage: 18.00, color: '#10B981' },
      { company_id: openaiId, owner_name: 'Founders / Early Team', percentage: 12.00, color: '#6366F1' }
    ]);
  }

  const sequoiaIdVal = investorMap.get('sequoia-capital');
  if (sequoiaIdVal) {
    console.log('Inserting Sequoia Capital portfolio concentrations...');
    await supabase.from('portfolio_concentration').insert([
      { investor_id: sequoiaIdVal, category: 'Foundation Models', percentage: 40.00, color: '#E53935' },
      { investor_id: sequoiaIdVal, category: 'AI Coding', percentage: 25.00, color: '#6366F1' },
      { investor_id: sequoiaIdVal, category: 'AI Agents', percentage: 20.00, color: '#10B981' },
      { investor_id: sequoiaIdVal, category: 'AI Search', percentage: 15.00, color: '#F59E0B' }
    ]);
  }

  // Competitor relationships
  if (openaiId) {
    const anthropicId = companyMap.get('anthropic');
    const xaiId = companyMap.get('xai');
    const mistralId = companyMap.get('mistral-ai');
    const competitors = [];
    if (anthropicId) competitors.push({ company_id: openaiId, competitor_id: anthropicId });
    if (xaiId) competitors.push({ company_id: openaiId, competitor_id: xaiId });
    if (mistralId) competitors.push({ company_id: openaiId, competitor_id: mistralId });

    console.log('Inserting competitor relationships...');
    await supabase.from('competitor_relations').insert(competitors);
  }

  console.log('🎉 Seeding successfully completed!');
}

seed().catch((err) => {
  console.error('❌ Seeding failed with unexpected error:', err);
});
