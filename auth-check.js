// auth-check.js
const AC_SUPABASE_URL = 'https://bdoesoqpjhpxkwsjauwo.supabase.co';
const AC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkb2Vzb3FwamhweGt3c2phdXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODUzODIsImV4cCI6MjA4MTA2MTM4Mn0.R2fgp-wqasPtn86gVcoM2RPpSMc-66_77F6VX-DzG-s';

async function checkAuthAndRedirect() {
    const sbClient = window.supabase.createClient(AC_SUPABASE_URL, AC_SUPABASE_ANON_KEY);

    const { data: { session } } = await sbClient.auth.getSession();

    const isAlevelPage = window.location.pathname.includes('/alevel/');
    const currentPage = window.location.pathname.split('/').pop();

    if (!session) {
        // Not logged in, redirect to signin
        if (!currentPage.includes('signin.html') &&
            !currentPage.includes('signup.html') &&
            !currentPage.includes('index.html') &&
            currentPage !== '') {
            window.location.href = 'signin.html';
        }
        return;
    }

    // maybeSingle() instead of single() — no error thrown when the user
    // has no profile row yet (e.g. mid-onboarding, before step4 has run)
    const { data: profile } = await sbClient
        .from('user_profiles')
        .select('onboarding_completed, course_level')
        .eq('id', session.user.id)
        .maybeSingle();

    if (!profile) {
        // No profile at all yet — only worth acting on if they've
        // somehow landed on a dashboard/add-subjects page too early
        if (currentPage === 'dashboard.html' || currentPage === 'add-subjects.html') {
            window.location.href = 'onboarding-step1.html';
        }
        return;
    }

    const profileIsAlevel = profile.course_level === 'A-Level';

    // A single account only ever has ONE profile row. If that profile
    // belongs to the other pathway (e.g. a GCSE profile, but we're
    // currently on an /alevel/ page), this script has nothing useful to
    // say — step back and let that page's own logic handle it, rather
    // than redirecting based on the wrong pathway's completion status.
    if (profileIsAlevel !== isAlevelPage) {
        return;
    }

    if (profile.onboarding_completed) {
        // Onboarding completed, redirect to dashboard if on onboarding pages
        if (currentPage.includes('onboarding-step')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        // Onboarding not completed, redirect to step 1 if on dashboard/add-subjects
        if (currentPage === 'dashboard.html' || currentPage === 'add-subjects.html') {
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
