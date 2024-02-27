// ----------------------------------------------------------------------

import { AuthService } from 'src/services/authentication-service';

export const account = {
  displayName: `${AuthService.userValue().firstName} ${AuthService.userValue().lastName}`,
  email: AuthService.userValue().email,
  photoURL: 'https://picsum.photos/300/300',
};
