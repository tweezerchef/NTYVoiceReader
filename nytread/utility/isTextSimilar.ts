import leven from 'leven';
function calculateTolerance(storedLogin: string): number {
    if (storedLogin.length <= 5) {
      return 1; // Very strict for short strings
    } else if (storedLogin.length <= 10) {
      return 2; // Moderately strict for medium-length strings
    } else {
      return 3; // More lenient for longer strings
    }
  }
export async function isVoiceLoginValid(transcribedLogin: string, storedLogin: string, tolerance: number = 2): Promise<boolean> {
  const normalizedTranscribed = transcribedLogin.trim().toLowerCase();
  const normalizedStored = storedLogin.trim().toLowerCase();

  const distance = leven(normalizedTranscribed, normalizedStored);
  return distance <= tolerance;
}
