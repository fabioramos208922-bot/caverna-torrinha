// Consent Mode v2: começa negado e só libera após o aceite do visitante.
(function () {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  const denied = {
    ad_storage: 'denied', analytics_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied'
  };
  const granted = {
    ad_storage: 'granted', analytics_storage: 'granted',
    ad_user_data: 'granted', ad_personalization: 'granted'
  };

  window.gtag('consent', 'default', { ...denied, wait_for_update: 500 });
  window.torrinhaConsentGranted = function () { window.gtag('consent', 'update', granted); };

  try {
    if (localStorage.getItem('torrinha_cookie_consent') === 'accepted') {
      window.torrinhaConsentGranted();
    }
  } catch (_) {}
}());
