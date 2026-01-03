import { Linking } from 'react-native';

const API_BASE = 'https://hawia.sa/api/list.php';
const POST_URL = 'https://hawia.sa/api/save_whatsapp.php';

export default async function fetchList() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const data = await res.json();
    return {
      status: data.status || '',
      data: Array.isArray(data.data) ? data.data : [],
    };
  } catch (err) {
    console.error('FetchList Error:', err);
    return { status: 'error', data: [] };
  }
}

export async function saveWhatsapp(phone) {
  try {
    const res = await fetch(POST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });

    const data = await res.json();
    if (data.status?.toLowerCase() === 'success') {
      return { success: true, message: data.message };
    }

    return { success: false, message: data.message || 'Unknown error' };
  } catch (err) {
    console.error('saveWhatsapp Error:', err);
    return { success: false, message: err.message };
  }
}

export async function openChat(phone, message = 'Hello! I want to order.') {
  const encoded = encodeURIComponent(message);

  const waUrl = `whatsapp://send?phone=${phone}&text=${encoded}`;
  const supportedWA = await Linking.canOpenURL(waUrl);

  if (supportedWA) return Linking.openURL(waUrl);

  const webUrl = `https://wa.me/${phone}?text=${encoded}`;
  const supportedWeb = await Linking.canOpenURL(webUrl);

  if (supportedWeb) return Linking.openURL(webUrl);

  console.warn('WhatsApp not installed or cannot open URL');
}
