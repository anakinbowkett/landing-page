// auth-check.js
const SUPABASE_URL = 'https://bdoesoqpjhpxkwsjauwo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkb2Vzb3FwamhweGt3c2phdXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODUzODIsImV4cCI6MjA4MTA2MTM4Mn0.R2fgp-wqasPtn86gVcoM2RPpSMc-66_77F6VX-DzG-s';

async function checkAuthAndRedirect() {
    const sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const { data: { session } } = await sbClient.auth.getSession();
    
    if (!session) {
        // Not logged in, redirect to signin
        if (!window.location.pathname.includes('signin.html') && 
            !window.location.pathname.includes('signup.html') &&
            !window.location.pathname.includes('index.html')) {
            window.location.href = 'signin.html';
        }
        return;
    }
    
    // User is logged in, check if onboarding is completed
    const { data: profile } = await sbClient
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('id', session.user.id)
        .single();
    
    const currentPage = window.location.pathname.split('/').pop();
    
    if (profile && profile.onboarding_completed) {
        // Onboarding completed, redirect to dashboard if on onboarding pages
        if (currentPage.includes('onboarding-step')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        // Onboarding not completed, redirect to step 1 if on dashboard
        if (currentPage === 'dashboard.html') {
            window.location.href = 'onboarding-step1.html';
        }
    }
}

// Run check when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAuthAndRedirect);
} else {
    checkAuthAndRedirect();
}
