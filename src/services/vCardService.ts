import { UserProfile } from '../types';

export function generateVCard(user: UserProfile) {
  const vCard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${user.name}`,
    `TEL;TYPE=CELL:${user.phone}`,
    `ORG:${user.college}`,
    `TITLE:${user.branch}`,
    `URL:${user.linkedin || ''}`,
    `X-SOCIALPROFILE;TYPE=instagram:${user.instagram}`,
    'END:VCARD'
  ].join('\n');

  const blob = new Blob([vCard], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${user.name.replace(/\s+/g, '_')}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
