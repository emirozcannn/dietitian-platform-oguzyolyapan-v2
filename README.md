# Oğuz Yolyapan - Professional Dietitian Website

A comprehensive bilingual (Turkish/English) website for Expert Dietitian Oğuz Yolyapan, featuring modern design, responsive layout, and extensive functionality with full email/SMS automation and payment integration.

## 🌟 Features

### 🌐 Multilingual Support
- **Turkish** (Default): Domain root `/`
- **English**: Domain `/en/`
- Language toggle available in header and footer
- Complete translation of all content using react-i18next

### 📱 Responsive Design
- Built with **Bootstrap 5** (no Tailwind CSS)
- Mobile-first approach
- Optimized for all devices and screen sizes
- Touch-friendly interfaces

### 🏥 Core Pages
1. **Home** - Hero section, services overview, testimonials
2. **About** - Professional biography, education, experience
3. **Blog** - Multilingual blog posts with SEO-friendly slugs
4. **Packages** - Service packages with detailed descriptions
5. **FAQ** - Accordion-style frequently asked questions
6. **Contact** - Contact form with Google Maps integration
7. **Appointment** - Online booking system with calendar
8. **Calculators** - BMI, BMR, Calorie, Water intake calculators
9. **Client Panel** - Secure client dashboard
10. **Admin Panel** - Content management system

### 🧮 Health Calculators
- **BMI Calculator** - Body Mass Index calculation
- **BMR Calculator** - Basal Metabolic Rate calculation
- **Calorie Calculator** - Daily calorie needs with activity levels
- **Water Intake Calculator** - Daily water requirements

### � Payment & E-commerce
- **PayTR Integration** - Secure payment processing
- **Shopping Cart** - Full cart functionality
- **Order Management** - Order tracking and history
- **Discount Coupons** - Automatic coupon system
- **Invoice Generation** - PDF invoice creation

### 📧 Email & SMS Automation
- **Mailgun Integration** - Professional email delivery
- **SMS Service** - Automated SMS notifications
- **Multi-channel Notifications** - Email + SMS combined
- **Template System** - Pre-designed email/SMS templates
- **Bulk Messaging** - Mass notification system

### 🔔 Notification System
- **Order Confirmations** - Automatic order notifications
- **Appointment Reminders** - Scheduled appointment alerts
- **Payment Notifications** - Payment status updates
- **Coupon Campaigns** - Automated discount campaigns
- **Newsletter System** - Email marketing automation

### �🔧 Technical Features
- **SEO Optimized** - Meta tags, structured data, sitemaps
- **Accessibility** - WCAG compliance, keyboard navigation
- **Performance** - Optimized loading, modern web standards
- **Security** - Secure authentication, data protection

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Bootstrap 5 + Bootstrap Icons
- **Internationalization**: react-i18next
- **Routing**: React Router DOM
- **SEO**: react-helmet-async
- **Forms**: react-hook-form + Yup validation
- **Backend**: Supabase (PostgreSQL + Auth)
- **Email**: Mailgun API
- **SMS**: NetGSM API (or similar)
- **Payment**: PayTR Integration
- **PDF**: jsPDF + jsPDF-AutoTable
- **HTTP Client**: Axios

## 📦 Installation & Setup

### 1. Clone and Install
```bash
git clone [repository-url]
cd oguz-yolyapan-website
npm install
```

### 2. Environment Variables
Create `.env` file using `.env.example`:
```bash
cp .env.example .env
```

Configure the following variables:
```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Mailgun
VITE_MAILGUN_API_KEY=your_mailgun_api_key
VITE_MAILGUN_DOMAIN=your_mailgun_domain
VITE_MAILGUN_FROM_EMAIL=info@yourdomain.com

# PayTR
VITE_PAYTR_MERCHANT_ID=your_paytr_merchant_id
VITE_PAYTR_MERCHANT_KEY=your_paytr_merchant_key
VITE_PAYTR_MERCHANT_SALT=your_paytr_merchant_salt
VITE_PAYTR_TEST_MODE=true

# SMS (NetGSM example)
VITE_SMS_API_KEY=your_sms_api_key
VITE_SMS_API_SECRET=your_sms_api_secret
VITE_SMS_API_URL=https://api.netgsm.com.tr/sms/send/get
```

### 3. Database Setup
Run the SQL files in order:
```sql
-- 1. Basic schema
database/project.sql

-- 2. Notification tables
database/notification_tables.sql
```

### 4. Third-party Service Setup

#### Mailgun Setup
1. Sign up at [Mailgun](https://www.mailgun.com)
2. Verify your domain
3. Get API credentials
4. Update environment variables

#### PayTR Setup
1. Sign up at [PayTR](https://www.paytr.com)
2. Complete merchant verification
3. Get merchant credentials
4. Set callback URLs in PayTR panel:
   - Success: `https://yourdomain.com/payment-success`
   - Fail: `https://yourdomain.com/payment-failed`
   - Callback: `https://yourdomain.com/payment-callback`

#### SMS Service Setup
1. Choose SMS provider (NetGSM, İletimerkezi, etc.)
2. Get API credentials
3. Update SMS configuration in environment

### 5. Development & Production

#### Development
```bash
npm run dev
```

#### Production Build
```bash
npm run build
npm run preview
```

#### Deploy
```bash
npm run build
# Deploy the dist/ folder to your hosting
```

## 🔧 Configuration

### Email Templates
Email templates are defined in `src/lib/emailService.js`:
- Order confirmation
- Appointment confirmation
- Coupon delivery
- Newsletter welcome

### SMS Templates
SMS templates are defined in `src/lib/smsService.js`:
- Order notifications
- Appointment reminders
- Payment confirmations
- Coupon codes

### Notification Channels
Configure notification preferences in `src/lib/notificationService.js`:
- Email only
- SMS only
- Both channels

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 🌍 Routing Structure

### Turkish Routes (Default)
- `/` - Anasayfa (Home)
- `/hakkimda` - Hakkımda (About)
- `/blog` - Blog
- `/paketler` - Paketler (Packages)
- `/sss` - Sık Sorulan Sorular (FAQ)
- `/iletisim` - İletişim (Contact)
- `/randevu` - Online Randevu (Appointment)
- `/hesaplayicilar` - Hesaplayıcılar (Calculators)
- `/giris` - Giriş (Login)
- `/danisan-paneli` - Danışan Paneli (Client Panel)
- `/yonetici-paneli` - Yönetici Paneli (Admin Panel)

### English Routes
- `/en` - Home
- `/en/about` - About
- `/en/blog` - Blog
- `/en/packages` - Packages
- `/en/faq` - FAQ
- `/en/contact` - Contact
- `/en/appointment` - Appointment
- `/en/calculators` - Calculators
- `/en/login` - Login
- `/en/client-panel` - Client Panel
- `/en/admin-panel` - Admin Panel

## 🎨 Design Guidelines

- **Bootstrap 5** for all components and styling
- **Bootstrap Icons** for consistent iconography
- **Modern UI/UX** with clean, professional design
- **Accessibility first** - WCAG 2.1 AA compliance
- **Mobile responsive** - Works on all devices

## 📧 Contact Integration

- **WhatsApp** floating button for quick contact
- **Email** contact forms with validation
- **Google Maps** integration for location
- **Social media** links and sharing

## 🔒 Security Features

- Secure authentication system
- Input validation and sanitization
- HTTPS enforcement
- Data encryption
- Session management

## 📈 SEO & Analytics

- **Meta tags** for all pages in both languages
- **Structured data** (JSON-LD) for search engines
- **Sitemap** generation for both languages
- **Google Analytics** integration ready
- **Performance optimization** for Core Web Vitals

## 🚀 Future Enhancements

- Payment integration (Stripe/iyzico)
- Real-time chat system
- Advanced booking system
- Mobile app development
- Advanced analytics dashboard

## 📄 License

© 2025 Oğuz Yolyapan. All rights reserved.

---

**Note**: This is a professional website for a licensed dietitian. All health-related content should be reviewed by medical professionals before implementation.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
