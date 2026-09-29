1) أنشئي حساب GitHub وأنشئي repository جديد (private مقبول).
2) ارفعي محتويات هذا المجلد كما هي (Add file ← Upload files) مع الحفاظ على المجلدات.
3) في Netlify: Add new site ← Import an existing project ← GitHub ← اختاري الـrepo. (الإعدادات تُقرأ من netlify.toml، اضغطي Deploy).
4) قبل أو بعد الرفع: Site configuration ← Environment variables وأضيفي:
   ADMIN_PASSWORD = كلمة سر قوية للوحة
   SESSION_SECRET = أي نص عشوائي طويل
   ثم أعيدي النشر (Deploys ← Trigger deploy).
5) لوحة التحكم: اسم-الموقع.netlify.app/admin
