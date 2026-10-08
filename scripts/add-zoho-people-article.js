const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const articlesPath = path.join(rootDir, 'data', 'articles.json');
const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

const slug = 'zoho-people-sri-lanka-cloud-hrms-attendance-leave-guide';

const bodyHtml = `
  <div class="callout" style="border-left: 4px solid #3b82f6; background: rgba(30, 41, 59, 0.7); padding: 20px 24px; border-radius: 0 12px 12px 0; margin-bottom: 32px;">
    <p style="font-size: 17px; font-weight: 700; color: #93c5fd; margin: 0; line-height: 1.5;">
      💡 Executive Summary: Human resource management in Sri Lanka has evolved beyond manual muster rolls, punch cards, and disconnected spreadsheets. In 2026, forward-thinking Sri Lankan enterprises are implementing <strong>Zoho People</strong>—the world-class cloud HRMS tailored for local labor compliance. Discover how certified implementation by PW Holdings delivers automated Shop &amp; Office Act leave management, biometric attendance synchronization, mobile geofencing, and seamless integration with Sri Lankan payroll (EPF, ETF &amp; APIT).
    </p>
  </div>

  <section class="art-section" style="margin-bottom: 36px;">
    <p style="font-size: 16.5px; line-height: 1.85; color: #cbd5e1; margin-bottom: 18px;">
      Managing human resources in Sri Lanka presents a distinct set of operational and regulatory challenges. From navigating the statutory mandates of the <strong>Shop &amp; Office Employees Act (No. 19 of 1954)</strong> and managing intricate mercantile holiday schedules to syncing multi-branch fingerprint attendance and calculating Loss of Pay (LOP) for monthly payroll, traditional HR departments spend hundreds of hours on administrative friction.
    </p>
    <p style="font-size: 16.5px; line-height: 1.85; color: #cbd5e1;">
      <strong>Zoho People</strong> transforms this entire ecosystem. As an all-in-one, cloud-native Human Resource Management System (HRMS), Zoho People centralizes employee lifecycles from onboarding and attendance tracking to performance appraisals, corporate document workflows, and offboarding. When implemented by <strong>PW Holdings</strong>—Sri Lanka's leading certified Zoho Authorized Partner—Zoho People is customized to meet the exact legal, statutory, and operational dynamics of Sri Lankan enterprises.
    </p>
  </section>

  <!-- ==========================================
       KEY BENEFITS HIGHLIGHTS
       ========================================== -->
  <section class="art-section" style="margin-bottom: 44px; padding: 28px; background: rgba(14, 23, 46, 0.85); border: 1.5px solid rgba(59, 130, 246, 0.35); border-radius: 18px;">
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
      <span style="background: #3b82f6; color: #fff; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px;">Enterprise HR Blueprint</span>
      <span style="color: #94a3b8; font-size: 13.5px;">Sri Lankan Labor Law Ready</span>
    </div>
    <h2 style="font-family: var(--font-heading); font-size: 26px; color: #ffffff; margin: 0 0 16px; letter-spacing: -0.01em;">
      🚀 Why Sri Lankan Enterprises Choose Zoho People
    </h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 16px; margin: 24px 0;">
      <div style="background: rgba(11, 19, 41, 0.85); padding: 20px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.08);">
        <div style="font-size: 28px; margin-bottom: 8px;">🇱🇰</div>
        <h4 style="color: #60a5fa; font-size: 16px; margin-bottom: 6px;">Labor Law Compliance</h4>
        <p style="font-size: 13.5px; color: #cbd5e1; margin: 0; line-height: 1.6;">Automated rules for Shop &amp; Office Act (14 Annual, 7 Casual, Medical leaves &amp; Mercantile holidays).</p>
      </div>
      <div style="background: rgba(11, 19, 41, 0.85); padding: 20px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.08);">
        <div style="font-size: 28px; margin-bottom: 8px;">⏱️</div>
        <h4 style="color: #34d399; font-size: 16px; margin-bottom: 6px;">Biometric Hardware Sync</h4>
        <p style="font-size: 13.5px; color: #cbd5e1; margin: 0; line-height: 1.6;">Direct real-time API integration with ZKTeco, Hikvision, and Realtime fingerprint and facial recognition scanners.</p>
      </div>
      <div style="background: rgba(11, 19, 41, 0.85); padding: 20px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.08);">
        <div style="font-size: 28px; margin-bottom: 8px;">📱</div>
        <h4 style="color: #f59e0b; font-size: 16px; margin-bottom: 6px;">Mobile Geofencing (ESS)</h4>
        <p style="font-size: 13.5px; color: #cbd5e1; margin: 0; line-height: 1.6;">GPS-tagged check-ins and IP restrictions for sales reps, remote employees, and branch staff.</p>
      </div>
      <div style="background: rgba(11, 19, 41, 0.85); padding: 20px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.08);">
        <div style="font-size: 28px; margin-bottom: 8px;">💰</div>
        <h4 style="color: #a855f7; font-size: 16px; margin-bottom: 6px;">Payroll &amp; EPF/ETF Sync</h4>
        <p style="font-size: 13.5px; color: #cbd5e1; margin: 0; line-height: 1.6;">Loss of Pay (LOP) and overtime data pushed directly into Zoho Payroll for automated statutory calculations.</p>
      </div>
    </div>
  </section>

  <!-- ==========================================
       SECTION 1: CORE MODULES OF ZOHO PEOPLE
       ========================================== -->
  <section class="art-section" style="margin-bottom: 36px;">
    <h2 style="font-family: var(--font-heading); font-size: 24px; color: #ffffff; margin: 32px 0 16px; letter-spacing: -0.01em;">
      1. Core Modules of Zoho People Tailored for Sri Lankan Businesses
    </h2>
    <div style="font-size: 16.5px; line-height: 1.85; color: #cbd5e1;">
      <p style="margin-bottom: 16px;">
        Zoho People is not just a digital filing cabinet—it is an end-to-end employee operations engine designed to remove administrative friction across every department:
      </p>

      <h3 style="font-family: var(--font-heading); font-size: 20px; color: #93c5fd; margin: 24px 0 10px;">A. Core HR &amp; Digital Employee Records</h3>
      <p style="margin-bottom: 16px;">
        Maintain comprehensive digital employee profiles containing national identity card (NIC) numbers, EPF/ETF registration IDs, bank account details for salary deposits, educational qualifications, job descriptions, and hierarchical reporting lines. Zoho People acts as a single, encrypted source of truth with automated reminders for probation end dates, contract renewals, and retirement milestones.
      </p>

      <h3 style="font-family: var(--font-heading); font-size: 20px; color: #93c5fd; margin: 24px 0 10px;">B. Smart Time &amp; Attendance Tracking</h3>
      <p style="margin-bottom: 16px;">
        Whether your workforce is stationed at a corporate head office in Colombo, working remotely across the island, or operating in Free Trade Zone manufacturing facilities, Zoho People captures accurate attendance without manual manipulation:
      </p>
      <ul style="margin: 0 0 20px 24px;">
        <li style="margin-bottom: 10px;"><strong>Biometric Machine Integration:</strong> Synchronize physical fingerprint, RFID, and facial recognition devices via API webhooks so in-and-out punch records populate instantaneously.</li>
        <li style="margin-bottom: 10px;"><strong>Mobile Punch-in with Geofencing:</strong> Enable field sales personnel and site supervisors to clock in using iOS and Android mobile apps only when physically within assigned client or site GPS coordinates.</li>
        <li style="margin-bottom: 10px;"><strong>Multi-Shift Scheduling:</strong> Configure rotational day/night shifts, grace periods, half-day tolerances, and automated late-coming deductions.</li>
        <li style="margin-bottom: 10px;"><strong>Overtime (OT) Automation:</strong> Automatically calculate standard OT, holiday OT, and weekend compensation in strict alignment with Sri Lankan labor regulations.</li>
      </ul>

      <h3 style="font-family: var(--font-heading); font-size: 20px; color: #93c5fd; margin: 24px 0 10px;">C. Automated Leave Management &amp; Statutory Approvals</h3>
      <p style="margin-bottom: 16px;">
        Eliminate paper leave forms and back-and-forth email approvals. Employees can submit leave requests through their mobile phone or web browser, view remaining balances in real time, and submit medical certificates digitally. Multi-level approval hierarchies ensure unit supervisors and HR managers approve requests in seconds.
      </p>

      <h3 style="font-family: var(--font-heading); font-size: 20px; color: #93c5fd; margin: 24px 0 10px;">D. Performance Management (PMS) &amp; 360-Degree Feedback</h3>
      <p style="margin-bottom: 16px;">
        Transition from stressful annual evaluations to continuous performance tracking. Set quantifiable Key Result Areas (KRAs) and organizational Goals, conduct quarterly self-evaluations, collect 360-degree peer reviews, and link performance matrices directly to promotion and increment decisions.
      </p>

      <h3 style="font-family: var(--font-heading); font-size: 20px; color: #93c5fd; margin: 24px 0 10px;">E. Employee Self-Service (ESS) &amp; Internal HR Service Desk</h3>
      <p style="margin-bottom: 16px;">
        Empower employees to download salary slips, request service verification letters, submit address updates, and open confidential HR query tickets directly through a self-service portal, reducing internal HR inquiries by over 60%.
      </p>
    </div>
  </section>

  <!-- ==========================================
       SECTION 2: SRI LANKA LABOR LAW COMPLIANCE
       ========================================== -->
  <section class="art-section" style="margin-bottom: 36px; padding: 28px; background: rgba(14, 23, 46, 0.7); border: 1px solid var(--border-glass); border-radius: 16px;">
    <h2 style="font-family: var(--font-heading); font-size: 24px; color: #ffffff; margin: 0 0 16px; letter-spacing: -0.01em;">
      2. Sri Lankan Labor Law Compliance: Configuring the Shop &amp; Office Act
    </h2>
    <div style="font-size: 16.5px; line-height: 1.85; color: #cbd5e1;">
      <p style="margin-bottom: 16px;">
        Sri Lankan labor regulations are stringent. Non-compliance with statutory leave rules or overtime limits can expose organizations to severe Labor Tribunal penalties and union disputes. When configuring Zoho People for local companies, PW Holdings implements the following legal frameworks:
      </p>

      <div style="overflow-x: auto; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14.5px; background: rgba(11, 19, 41, 0.85); border: 1px solid var(--border-glass); border-radius: 10px;">
          <thead>
            <tr style="background: rgba(59, 130, 246, 0.2); border-bottom: 2px solid var(--border-glass);">
              <th style="padding: 12px 16px; text-align: left; color: #ffffff; font-weight: 700;">Statutory Provision</th>
              <th style="padding: 12px 16px; text-align: left; color: #93c5fd; font-weight: 700;">Legal Requirement (Sri Lanka)</th>
              <th style="padding: 12px 16px; text-align: left; color: #34d399; font-weight: 700;">Zoho People Configuration by PW Holdings</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid var(--border-glass);">
              <td style="padding: 12px 16px; font-weight: 600; color: #ffffff;">Annual Leave</td>
              <td style="padding: 12px 16px; color: #cbd5e1;">14 days per calendar year following first full year of employment; calculated proportionately during year one.</td>
              <td style="padding: 12px 16px; color: #34d399;">Automated prorated accrual based on date of joining with year-end encashment/carry-over controls.</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-glass); background: rgba(255, 255, 255, 0.02);">
              <td style="padding: 12px 16px; font-weight: 600; color: #ffffff;">Casual Leave</td>
              <td style="padding: 12px 16px; color: #cbd5e1;">7 days per year for private business or unexpected emergencies; 1 day for every completed 2 months in year one.</td>
              <td style="padding: 12px 16px; color: #34d399;">System-enforced maximum consecutive-day limits preventing unauthorized multi-day casual stretches.</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-glass);">
              <td style="padding: 12px 16px; font-weight: 600; color: #ffffff;">Mercantile Holidays</td>
              <td style="padding: 12px 16px; color: #cbd5e1;">Mandatory paid holidays under Shop &amp; Office Act (approximately 8 to 9 holidays annually).</td>
              <td style="padding: 12px 16px; color: #34d399;">Sri Lanka national holiday calendar pre-populated with Mercantile, Public, and Bank holiday tagging.</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-glass); background: rgba(255, 255, 255, 0.02);">
              <td style="padding: 12px 16px; font-weight: 600; color: #ffffff;">Overtime (OT) Pay</td>
              <td style="padding: 12px 16px; color: #cbd5e1;">1.5x regular hourly rate for work exceeding 8 hours/day or 45 hours/week.</td>
              <td style="padding: 12px 16px; color: #34d399;">Automated overtime calculation formula integrated with biometric punch times and supervisor pre-approval.</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; color: #ffffff;">Maternity Leave</td>
              <td style="padding: 12px 16px; color: #cbd5e1;">84 working days (12 weeks) paid maternity leave for all live births.</td>
              <td style="padding: 12px 16px; color: #34d399;">Dedicated maternity policy with automated entitlement tracking and resumption-of-work reminders.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ==========================================
       SECTION 3: INTEGRATION WITH PAYROLL & BOOKS
       ========================================== -->
  <section class="art-section" style="margin-bottom: 36px;">
    <h2 style="font-family: var(--font-heading); font-size: 24px; color: #ffffff; margin: 32px 0 16px; letter-spacing: -0.01em;">
      3. The Golden Triangle: Zoho People + Zoho Payroll + Zoho Books
    </h2>
    <div style="font-size: 16.5px; line-height: 1.85; color: #cbd5e1;">
      <p style="margin-bottom: 16px;">
        One of the biggest pain points for Sri Lankan HR and finance teams is the monthly cutover between attendance and payroll. In traditional setups, HR exports attendance into Excel, manually computes unpaid leaves, emails the file to accountants, and hopes formulas don&apos;t break.
      </p>
      <p style="margin-bottom: 16px;">
        With PW Holdings&apos; enterprise architecture, <strong>Zoho People talks natively to Zoho Payroll and Zoho Books</strong>:
      </p>

      <div style="background: rgba(14, 23, 46, 0.85); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 12px; padding: 20px 24px; margin: 24px 0; text-align: center; font-family: var(--font-heading); font-weight: 700; color: #93c5fd; font-size: 15px;">
        [Zoho People: Leaves &amp; LOP Hours] &nbsp;➔&nbsp; [Zoho Payroll: EPF/ETF &amp; APIT Processing] &nbsp;➔&nbsp; [Zoho Books: General Ledger Journal &amp; Bank Disk File]
      </div>

      <ul style="margin: 0 0 20px 24px;">
        <li style="margin-bottom: 12px;"><strong>Automated LOP Sync:</strong> Unapproved absences and excess leaves convert directly into Loss of Pay (LOP) days inside Zoho Payroll with a single click.</li>
        <li style="margin-bottom: 12px;"><strong>100% Sri Lankan Statutory Accuracy:</strong> Zoho Payroll processes EPF (12% employer, 8% employee), ETF (3%), and APIT tax deductions based on exact verified attendance days.</li>
        <li style="margin-bottom: 12px;"><strong>Automated General Ledger Posting:</strong> Once the monthly payroll run is approved, salary expense journals, statutory liabilities, and employer contribution lines post automatically to Zoho Books without manual double-entry.</li>
        <li style="margin-bottom: 12px;"><strong>Direct Bank Transfers:</strong> Export ready-to-upload electronic disk files formatted specifically for Commercial Bank (PayMaster), Sampath Bank, HNB, or BOC.</li>
      </ul>
    </div>
  </section>

  <!-- ==========================================
       SECTION 4: BIOMETRIC HARDWARE INTEGRATION
       ========================================== -->
  <section class="art-section" style="margin-bottom: 36px;">
    <h2 style="font-family: var(--font-heading); font-size: 24px; color: #ffffff; margin: 32px 0 16px; letter-spacing: -0.01em;">
      4. Biometric Device Integration in Sri Lanka (ZKTeco, Hikvision, Realtime)
    </h2>
    <div style="font-size: 16.5px; line-height: 1.85; color: #cbd5e1;">
      <p style="margin-bottom: 16px;">
        Many Sri Lankan companies hesitate to switch to cloud HR software because they have existing physical biometric attendance terminals installed across head offices, factory gates, and branch showrooms.
      </p>
      <p style="margin-bottom: 16px;">
        <strong>PW Holdings eliminates this barrier.</strong> Our certified technical engineering team deploys lightweight, secure API connector services that link your local biometric readers directly with Zoho People Cloud:
      </p>
      <ul style="margin: 0 0 20px 24px;">
        <li style="margin-bottom: 10px;"><strong>Supported Brands:</strong> ZKTeco (SilkID, BioPro, IN01), Hikvision Facial Terminals, Realtime, eSSL, and Suprema.</li>
        <li style="margin-bottom: 10px;"><strong>Near Real-Time Data Push:</strong> As soon as an employee taps their finger or presents their face at the turnstile, the punch timestamp pushes securely via HTTPS to Zoho People.</li>
        <li style="margin-bottom: 10px;"><strong>Offline Resiliency:</strong> If an internet connection drops at a regional factory in Anuradhapura or Galle, the biometric hardware stores punch logs locally and automatically syncs to the cloud once connectivity resumes.</li>
      </ul>
    </div>
  </section>

  <!-- ==========================================
       SECTION 5: COMPARISON TABLE
       ========================================== -->
  <section class="art-section" style="margin-bottom: 40px;">
    <h2 style="font-family: var(--font-heading); font-size: 24px; color: #ffffff; margin: 32px 0 16px; letter-spacing: -0.01em;">
      5. Zoho People vs. Legacy Desktop HR Software vs. Excel
    </h2>
    <div style="overflow-x: auto; margin: 24px 0;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14.5px; background: rgba(14, 23, 46, 0.7); border: 1px solid var(--border-glass); border-radius: 12px;">
        <thead>
          <tr style="background: rgba(59, 130, 246, 0.2); border-bottom: 2px solid var(--border-glass);">
            <th style="padding: 14px 18px; text-align: left; color: #ffffff; font-weight: 700;">Operational Dimension</th>
            <th style="padding: 14px 18px; text-align: left; color: #60a5fa; font-weight: 800;">Zoho People (PW Holdings)</th>
            <th style="padding: 14px 18px; text-align: left; color: #cbd5e1; font-weight: 600;">Legacy On-Premise HR Systems</th>
            <th style="padding: 14px 18px; text-align: left; color: #94a3b8; font-weight: 600;">Manual Excel Workbooks</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid var(--border-glass);">
            <td style="padding: 12px 18px; font-weight: 700; color: #ffffff;">Cloud &amp; Mobile Access</td>
            <td style="padding: 12px 18px; color: #34d399; font-weight: 700;">✅ 100% Cloud + iOS &amp; Android ESS apps</td>
            <td style="padding: 12px 18px; color: #f87171;">❌ Locked to office desktop LAN server</td>
            <td style="padding: 12px 18px; color: #f87171;">❌ Desktop files prone to corruption</td>
          </tr>
          <tr style="border-bottom: 1px solid var(--border-glass); background: rgba(255, 255, 255, 0.02);">
            <td style="padding: 12px 18px; font-weight: 700; color: #ffffff;">Biometric Syncing</td>
            <td style="padding: 12px 18px; color: #34d399; font-weight: 700;">✅ Automated real-time multi-branch cloud sync</td>
            <td style="padding: 12px 18px; color: #cbd5e1;">⚠️ Requires manual USB disk transfer</td>
            <td style="padding: 12px 18px; color: #f87171;">❌ 100% manual typing</td>
          </tr>
          <tr style="border-bottom: 1px solid var(--border-glass);">
            <td style="padding: 12px 18px; font-weight: 700; color: #ffffff;">Sri Lanka Labor Laws</td>
            <td style="padding: 12px 18px; color: #34d399; font-weight: 700;">✅ Shop &amp; Office Act pre-configured</td>
            <td style="padding: 12px 18px; color: #cbd5e1;">⚠️ Static rules requiring costly vendor updates</td>
            <td style="padding: 12px 18px; color: #f87171;">❌ High risk of formula error &amp; penalties</td>
          </tr>
          <tr style="border-bottom: 1px solid var(--border-glass); background: rgba(255, 255, 255, 0.02);">
            <td style="padding: 12px 18px; font-weight: 700; color: #ffffff;">Employee Self-Service</td>
            <td style="padding: 12px 18px; color: #34d399; font-weight: 700;">✅ Mobile leave apply, check-in, payslip view</td>
            <td style="padding: 12px 18px; color: #f87171;">❌ Non-existent or outdated web portal</td>
            <td style="padding: 12px 18px; color: #f87171;">❌ Paper forms and WhatsApp messages</td>
          </tr>
          <tr style="border-bottom: 1px solid var(--border-glass);">
            <td style="padding: 12px 18px; font-weight: 700; color: #ffffff;">Performance &amp; LMS</td>
            <td style="padding: 12px 18px; color: #34d399; font-weight: 700;">✅ Built-in KRAs, 360 appraisals &amp; LMS</td>
            <td style="padding: 12px 18px; color: #f87171;">❌ Separate expensive software needed</td>
            <td style="padding: 12px 18px; color: #f87171;">❌ Unstructured notes and emails</td>
          </tr>
          <tr style="background: rgba(59, 130, 246, 0.15);">
            <td style="padding: 14px 18px; font-weight: 800; color: #ffffff;">Total Cost of Ownership (TCO)</td>
            <td style="padding: 14px 18px; color: #34d399; font-weight: 900;">🏆 Predictable per-user fee, zero server cost</td>
            <td style="padding: 14px 18px; color: #f87171;">High upfront license + annual maintenance (AMC)</td>
            <td style="padding: 14px 18px; color: #f87171;">Hidden costs in wasted staff hours</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- ==========================================
       SECTION 6: PW HOLDINGS IMPLEMENTATION METHODOLOGY
       ========================================== -->
  <section class="art-section" style="margin-bottom: 36px;">
    <h2 style="font-family: var(--font-heading); font-size: 24px; color: #ffffff; margin: 32px 0 16px; letter-spacing: -0.01em;">
      6. The PW Holdings 5-Phase Implementation Methodology
    </h2>
    <div style="font-size: 16.5px; line-height: 1.85; color: #cbd5e1;">
      <p style="margin-bottom: 16px;">
        An HRMS implementation touches every single person inside an organization. Successful adoption requires empathy, clear communication, and technical rigor. PW Holdings executes deployments in five structured phases:
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin: 24px 0;">
        <div style="background: rgba(14, 23, 46, 0.85); padding: 20px; border-radius: 12px; border: 1px solid var(--border-glass);">
          <div style="color: #60a5fa; font-weight: 800; font-size: 14px; margin-bottom: 6px;">PHASE 1</div>
          <h4 style="color: #fff; font-size: 17px; margin-bottom: 8px;">HR Audit &amp; Policy Mapping</h4>
          <p style="font-size: 14px; color: #94a3b8; margin: 0; line-height: 1.6;">Review company employee handbook, leave allowances, probation rules, shift rosters, and statutory employment contracts.</p>
        </div>
        <div style="background: rgba(14, 23, 46, 0.85); padding: 20px; border-radius: 12px; border: 1px solid var(--border-glass);">
          <div style="color: #60a5fa; font-weight: 800; font-size: 14px; margin-bottom: 6px;">PHASE 2</div>
          <h4 style="color: #fff; font-size: 17px; margin-bottom: 8px;">System Configuration &amp; Deluge</h4>
          <p style="font-size: 14px; color: #94a3b8; margin: 0; line-height: 1.6;">Configure organizational departments, designation levels, approval workflows, custom fields, and email notification triggers.</p>
        </div>
        <div style="background: rgba(14, 23, 46, 0.85); padding: 20px; border-radius: 12px; border: 1px solid var(--border-glass);">
          <div style="color: #60a5fa; font-weight: 800; font-size: 14px; margin-bottom: 6px;">PHASE 3</div>
          <h4 style="color: #fff; font-size: 17px; margin-bottom: 8px;">Biometric &amp; Payroll Bridging</h4>
          <p style="font-size: 14px; color: #94a3b8; margin: 0; line-height: 1.6;">Install and test hardware API connectors linking physical fingerprint terminals to Zoho People and map LOP rules into Zoho Payroll.</p>
        </div>
        <div style="background: rgba(14, 23, 46, 0.85); padding: 20px; border-radius: 12px; border: 1px solid var(--border-glass);">
          <div style="color: #60a5fa; font-weight: 800; font-size: 14px; margin-bottom: 6px;">PHASE 4</div>
          <h4 style="color: #fff; font-size: 17px; margin-bottom: 8px;">Data Migration &amp; Parallel Run</h4>
          <p style="font-size: 14px; color: #94a3b8; margin: 0; line-height: 1.6;">Migrate opening leave balances and employee dossiers. Execute a parallel attendance and leave run alongside legacy methods to ensure 100% precision.</p>
        </div>
        <div style="background: rgba(14, 23, 46, 0.85); padding: 20px; border-radius: 12px; border: 1px solid var(--border-glass);">
          <div style="color: #60a5fa; font-weight: 800; font-size: 14px; margin-bottom: 6px;">PHASE 5</div>
          <h4 style="color: #fff; font-size: 17px; margin-bottom: 8px;">Staff Training &amp; Go-Live</h4>
          <p style="font-size: 14px; color: #94a3b8; margin: 0; line-height: 1.6;">Interactive workshops conducted in English and Sinhala for HR managers, department heads, and general staff, backed by 24/7 SLA engineering support.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================
       SECTION 7: FAQ SECTION (AEO)
       ========================================== -->
  <section class="art-faq-box" style="margin-top: 44px; padding: 28px; background: rgba(14, 23, 46, 0.9); border: 1.5px solid rgba(59, 130, 246, 0.3); border-radius: 18px;">
    <h2 style="font-size: 22px; color: #93c5fd; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
      <span>💬 Frequently Asked Questions (Zoho People Sri Lanka)</span>
    </h2>
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="padding: 16px 20px; background: rgba(11, 19, 41, 0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;">
        <h3 style="font-size: 16.5px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">Q1: Is Zoho People compliant with Sri Lankan labor laws?</h3>
        <p style="font-size: 15px; color: #94a3b8; line-height: 1.65; margin: 0;">Yes. When implemented by certified partners like PW Holdings, Zoho People is configured to adhere fully to the Shop and Office Employees Act (No. 19 of 1954), Factories Ordinance, national mercantile holiday calendars, and statutory overtime calculation formulas.</p>
      </div>
      <div style="padding: 16px 20px; background: rgba(11, 19, 41, 0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;">
        <h3 style="font-size: 16.5px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">Q2: Can Zoho People connect to physical fingerprint and facial recognition scanners in Sri Lanka?</h3>
        <p style="font-size: 15px; color: #94a3b8; line-height: 1.65; margin: 0;">Yes. PW Holdings integrates leading hardware brands including ZKTeco, Hikvision, Realtime, and eSSL via secure automated API bridges. Timestamps from multiple branch locations sync in real time to the cloud.</p>
      </div>
      <div style="padding: 16px 20px; background: rgba(11, 19, 41, 0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;">
        <h3 style="font-size: 16.5px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">Q3: How does Zoho People sync with Sri Lankan payroll (EPF/ETF)?</h3>
        <p style="font-size: 15px; color: #94a3b8; line-height: 1.65; margin: 0;">Zoho People directly pushes approved leaves, unpaid absences, and overtime hours into Zoho Payroll. Zoho Payroll then automatically computes statutory EPF (12%/8%), ETF (3%), and APIT deductions without any manual spreadsheet exports.</p>
      </div>
      <div style="padding: 16px 20px; background: rgba(11, 19, 41, 0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;">
        <h3 style="font-size: 16.5px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">Q4: What is the cost of implementing Zoho People in Sri Lanka?</h3>
        <p style="font-size: 15px; color: #94a3b8; line-height: 1.65; margin: 0;">Zoho People licensing is priced per active employee per month on an annual subscription, making it highly affordable for both small teams and 500+ employee enterprises. Implementation by PW Holdings includes custom policy setup, hardware API integration, data migration, and comprehensive staff training.</p>
      </div>
      <div style="padding: 16px 20px; background: rgba(11, 19, 41, 0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;">
        <h3 style="font-size: 16.5px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">Q5: Who is the certified Zoho People Authorized Partner in Sri Lanka?</h3>
        <p style="font-size: 15px; color: #94a3b8; line-height: 1.65; margin: 0;">PW Holdings is the premier certified Zoho Authorized Partner in Sri Lanka, having implemented over 350+ cloud architectures across Sri Lanka and worldwide. PW Holdings provides dedicated consulting and engineering support from Colombo and Kurunegala.</p>
      </div>
    </div>
  </section>
`;

const faqs = [
  {
    q: "Is Zoho People compliant with Sri Lankan labor laws?",
    a: "Yes. When implemented by certified partners like PW Holdings, Zoho People is configured to adhere fully to the Shop and Office Employees Act (No. 19 of 1954), Factories Ordinance, national mercantile holiday calendars, and statutory overtime calculation formulas."
  },
  {
    q: "Can Zoho People connect to physical fingerprint and facial recognition scanners in Sri Lanka?",
    a: "Yes. PW Holdings integrates leading hardware brands including ZKTeco, Hikvision, Realtime, and eSSL via secure automated API bridges. Timestamps from multiple branch locations sync in real time to the cloud."
  },
  {
    q: "How does Zoho People sync with Sri Lankan payroll (EPF/ETF)?",
    a: "Zoho People directly pushes approved leaves, unpaid absences, and overtime hours into Zoho Payroll. Zoho Payroll then automatically computes statutory EPF (12%/8%), ETF (3%), and APIT deductions without any manual spreadsheet exports."
  },
  {
    q: "What is the cost of implementing Zoho People in Sri Lanka?",
    a: "Zoho People licensing is priced per active employee per month on an annual subscription, making it highly affordable for both small teams and 500+ employee enterprises. Implementation by PW Holdings includes custom policy setup, hardware API integration, data migration, and comprehensive staff training."
  },
  {
    q: "Who is the certified Zoho People Authorized Partner in Sri Lanka?",
    a: "PW Holdings is the premier certified Zoho Authorized Partner in Sri Lanka, having implemented over 350+ cloud architectures across Sri Lanka and worldwide. PW Holdings provides dedicated consulting and engineering support from Colombo and Kurunegala."
  }
];

const newArticle = {
  slug: slug,
  title: "Zoho People Sri Lanka: Complete Cloud HRMS, Attendance, Leave & Performance Guide (2026)",
  description: "Master Zoho People in Sri Lanka. Complete guide to cloud HRMS, Shop & Office Act leave compliance, biometric attendance sync, mobile geofencing, EPF/ETF payroll integration & certified setup by PW Holdings.",
  category: "payroll",
  categoryLabel: "HRMS & People Operations",
  date: "October 8, 2026",
  readTime: "11 min read",
  region: "Sri Lanka • Colombo & Kurunegala",
  ctaHeading: "Ready to Transform Your HR Operations with Zoho People in Sri Lanka?",
  ctaText: "Eliminate manual attendance registers, automate Shop & Office Act leaves, and seamlessly connect HR with Sri Lankan payroll. Consult with certified Zoho implementation architects at PW Holdings.",
  author: "PW Holdings Enterprise HR Cloud Architecture Team",
  image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
  url: `articles/${slug}.html`,
  headline: "The Definitive 2026 Guide to Zoho People HRMS Implementation in Sri Lanka",
  bodyHtml: bodyHtml,
  faq: faqs
};

const existingIdx = articles.findIndex(a => a.slug === slug);
if (existingIdx !== -1) {
  articles[existingIdx] = newArticle;
  console.log(`Updated existing article ${slug}`);
} else {
  // Insert at position 2 (right after best partner & enterprise zoho one)
  articles.splice(2, 0, newArticle);
  console.log(`Inserted new article ${slug} at position 2`);
}

fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2), 'utf8');
console.log('Saved data/articles.json successfully!');
