
import { ApiTransaction, Transaction } from '../types';
import { GOOGLE_SCRIPT_URL } from '../constants';

export const logTransactionToSheets = async (transaction: ApiTransaction): Promise<boolean> => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(transaction),
      headers: { "Content-Type": "text/plain" }
    });
    
    if (!response.ok) {
      console.error("API call failed:", response.statusText);
      return false;
    }
    
    const data = await response.json();
    console.log("Logged to sheets:", data);
    return true;
  } catch (error) {
    console.error("Error logging transaction:", error);
    return false;
  }
};
