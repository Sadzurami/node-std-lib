import { Session } from './interfaces/session.interface';

export function getSessionExpiryDate(session: Session): Date {
  try {
    const date = new Date(session.ExpiryDate);
    if (!isNaN(date.getTime())) return date;

    const timestamp = Math.min(
      decodeRefreshToken(session.WebRefreshToken).exp,
      decodeRefreshToken(session.MobileRefreshToken).exp,
      decodeRefreshToken(session.DesktopRefreshToken).exp,
    );

    return new Date(timestamp * 1000);
  } catch (error) {
    throw new Error('Failed to get session expiry date', { cause: error });
  }
}

export function decodeRefreshToken(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Token must have 3 parts');

    const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payloadString = Buffer.from(payloadBase64, 'base64').toString('utf-8');
    const payloadJson = JSON.parse(payloadString);

    return payloadJson as { iss: string; sub: string; aud: string[]; exp: number };
  } catch (error) {
    throw new Error('Failed to decode refresh token', { cause: error });
  }
}
