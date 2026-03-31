# Deployment Guide for Habit-AI with GitHub Pro

## 🚀 Deployment Options

With your GitHub Pro account, you have several deployment options:

### Option 1: Heroku (Easiest - $7/month minimum)
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create backend app
heroku create habit-ai-backend --stack container
heroku addons:create heroku-postgresql:hobby-dev -a habit-ai-backend

# Add environment variables
heroku config:set SECRET_KEY=your-secret-key -a habit-ai-backend
heroku config:set CORS_ORIGINS=https://your-frontend.herokuapp.com -a habit-ai-backend

# Deploy
git push heroku main

# Create frontend app
heroku create habit-ai-frontend --stack container
heroku config:set REACT_APP_API_URL=https://habit-ai-backend.herokuapp.com -a habit-ai-frontend
git push heroku main
```

### Option 2: ManagedCloud Platforms (GitHub Actions Integration)
- **Render.com**: Free tier available (pause after 15 min inactivity)
- **Railway.app**: $5 free credit monthly
- **Fly.io**: Generous free tier with global deployment

### Option 3: AWS (Most Scalable - Can use free tier)
```bash
# Install AWS CLI & Terraform
brew install awscli terraform  # macOS
# or choco install awscli terraform  # Windows

# Configure AWS credentials
aws configure

# Deploy infrastructure
cd infra/aws
terraform init
terraform plan -out=planfile
terraform apply planfile
```

### Option 4: DigitalOcean App Platform ($5-12/month)
```bash
# Perfect for full-stack apps
# Connect your GitHub repo directly in the UI
# DigitalOcean auto-deploys on push to main
```

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Update `.env.example` files with all required variables
- [ ] Test locally with `docker-compose up`
- [ ] Ensure all tests pass: `npm test`, `pytest`
- [ ] Update README with deployment instructions
- [ ] Create GitHub Secrets for sensitive variables

### Create GitHub Secrets
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add required secrets:
   ```
   HEROKU_API_KEY=your-heroku-api-key
   HEROKU_APP_NAME=habit-ai-backend
   DATABASE_URL=postgresql://user:pass@host:5432/db
   SECRET_KEY=your-secret-key-min-32-chars
   ```

### GitHub Actions Workflow
Workflows are already configured in `.github/workflows/`:
- `deploy.yml` - Builds and deploys on push to main
- `quality.yml` - Runs tests and security checks

---

## 🎯 Recommended Deployment Path

### For Quick Testing → Heroku
```bash
# 5 minutes to deploy
heroku create habit-ai-beta
git push heroku main
```

### For Small-Medium Production → Railway/Render
- Free tier available
- Auto-deploys from GitHub
- PostgreSQL included
- Perfect for student projects

### For Enterprise → AWS Terraform
- Full infrastructure as code
- Auto-scaling
- CDN
- RDS backups
- Complete monitoring

---

## 🔐 Environment Variables Required

### Backend
```
DATABASE_URL=postgresql://user:pass@host/db
SECRET_KEY=min-32-character-secret-key
CORS_ORIGINS=https://frontend.example.com
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend
```
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENV=production
```

### Mobile
```
API_URL=https://api.example.com
ENV=production
```

---

## 📊 Cost Comparison

| Platform | Cost | Setup Time | Auto-Deploy |
|----------|------|-----------|------------|
| Heroku | $7+/month | 5 min | ✅ |
| Railway | $5/month free tier | 5 min | ✅ |
| Render | Free (with pause) | 5 min | ✅ |
| AWS | $0-20/month | 20 min | ✅ |
| DigitalOcean | $5+/month | 10 min | ✅ |
| Fly.io | Free tier generous | 10 min | ✅ |

---

## 🚢 Post-Deployment

### Monitor Your Deployment
```bash
# Heroku logs
heroku logs -t -a habit-ai-backend

# AWS
aws logs tail /ecs/habit-ai-backend --follow
```

### Set Up CI/CD Alerts
- GitHub Actions notifications
- Slack integration
- Email alerts on failure

### Domain Setup
```
Frontend: www.habit-ai.com → CDN/Vercel
API: api.habit-ai.com → Load Balancer
```

---

## 🆘 Troubleshooting

### Django/FastAPI Migrations
```bash
# Heroku
heroku run "python -m app.database" -a habit-ai-backend

# AWS ECS
aws ecs execute-command \
  --cluster habit-ai-cluster \
  --task <task-id> \
  --container backend \
  --interactive \
  --command "/bin/bash"
```

### View Logs
```bash
# Heroku
heroku logs -t -a habit-ai-backend

# AWS CloudWatch
aws logs tail /ecs/habit-ai-backend --follow

# DigitalOcean
doctl apps get <app-id> --format=active --no-header | \
  doctl apps logs get <app-id> --follow
```

---

## 📚 Next Steps

1. **Choose your platform** from the options above
2. **Set up GitHub Secrets** with deployment credentials
3. **Push to main branch** → GitHub Actions auto-deploys
4. **Monitor** the deployment in GitHub Actions tab
5. **Access** your live application!

---

**Need help? Check the platform-specific guides below:**
- [Heroku Deployment](https://devcenter.heroku.com/articles/getting-started-with-python)
- [AWS ECS](https://aws.amazon.com/ecs/)
- [Railway Docs](https://railway.app/docs)
- [Terraform AWS](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
