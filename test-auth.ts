import { auth } from './src/lib/auth/auth';

async function test() {
  try {
    // Try passing a mock request
    const mockRequest = new Request("http://localhost/api/auth/sign-up/email", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
        name: "Test User"
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const res = await auth.handler(mockRequest);
    const data = await res.json();
    console.log(data);
  } catch (e) {
    console.error(e);
  }
}
test();
