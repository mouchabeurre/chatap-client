interface _BASIC {
  success: boolean;
}
interface _ERROR extends _BASIC {
  method?: string;
  path?: string;
  error?: string;
}
export interface AVAILABLE extends _ERROR {
  available: boolean;
}
export interface REGISTER extends _ERROR {

}
export interface AUTHENTICATE extends _ERROR {
  token: string;
}