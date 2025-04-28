import dns from 'dns';

const getEmailProvider = (email) => {
  const domain = email.split('@')[1];

  return new Promise((resolve) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        return resolve(null);
      }

      const mxRecord = addresses[0].exchange;
      if (mxRecord.includes('google.com')) return resolve('Gmail');
      if (mxRecord.includes('yahoo.com')) return resolve('Yahoo');
      if (mxRecord.includes('outlook.com') || mxRecord.includes('hotmail.com')) return resolve('Outlook');
      if (mxRecord.includes('icloud.com')) return resolve('Apple Mail');
      if (mxRecord.includes('protonmail.com')) return resolve('ProtonMail');
      if (mxRecord.includes('zoho.com')) return resolve('Zoho Mail');

      return resolve('Unknown provider');
    });
  });
};

export default getEmailProvider;
