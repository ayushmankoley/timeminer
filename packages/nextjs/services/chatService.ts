export async function sendMessage(message: string): Promise<string> {
  try {
    const response = await fetch('/api/sendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to communicate with API');
    }

    const data = await response.json();
    return data.reply;
  } catch (error: any) {
    console.error('Error in sendMessage:', error);
    throw new Error(`Failed to get response from server: ${error.message}`);
  }
}
