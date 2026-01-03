export function filterCompaniesByCity(companies, city) {
  if (!city || city === 'all cities') return companies;
  return companies.filter(item =>
    item.company_city?.toLowerCase().includes(city.toLowerCase()),
  );
}

export function filterCompanies(companies, selectedCity, searchText) {
  if (!Array.isArray(companies)) return [];

  const search = searchText?.toLowerCase().trim() || '';
  const city = selectedCity?.toLowerCase() || 'all cities';

  return companies.filter(company => {
    const matchesCity =
      city === 'all cities' || company.company_city?.toLowerCase() === city;

    const matchesName =
      company.company_name?.toLowerCase().includes(search) ||
      company.company_city?.toLowerCase().includes(search);

    return matchesCity && matchesName;
  });
}


import { Linking } from 'react-native';

export const openWhatsapp = async (phone: number | string, message: string) => {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    console.warn("Can't open WhatsApp");
  }
};



import { saveWhatsapp, openChat } from '../api/index.js';

export const handleWhatsappOrder = async (
  phoneNumber: string,
  company: { contact_no?: string },
  onClose?: () => void,
  onResetPhone?: () => void
) => {
  if (!phoneNumber) return;

  try {
    const response = await saveWhatsapp(phoneNumber);

    if (response.success) {
      let raw = company.contact_no || '';
      raw = raw.replace(/\D/g, ''); 
      raw = raw.replace(/^0/, ''); 
      const fullNumber = `966${raw}`;
      await openChat(fullNumber);
    }
  } catch (err) {
    console.warn('Error sending WhatsApp:', err);
  } finally {
    if (onClose) onClose();
    if (onResetPhone) onResetPhone();
  }
};

