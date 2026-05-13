import { auth } from '@/integrations/auth/auth';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getAuthInstance(): any {
    return auth;
  }

  // Helper methods for auth operations
  async getSession(sessionToken: string) {
    return await auth.api.getSession({
      headers: {
        cookie: `auth_token=${sessionToken}`,
      },
    });
  }
}
