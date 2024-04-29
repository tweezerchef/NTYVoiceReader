// Example API route for refreshing JWT
export const POST = async (req: Request) => {
    const refreshToken = req.cookies.refreshToken;
    // Validate refresh token
    if (isValidRefreshToken(refreshToken)) {
      const newToken = jwt.sign({ login }, JWT_SECRET, { expiresIn: '1h' });
      return new Response(JSON.stringify({ token: newToken }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ error: "Invalid refresh token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
  };
