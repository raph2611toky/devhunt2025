// import CryptoJS from "crypto-js";

// const SECRET_KEY =
//   "U2FsdGVkX1/CbFOvspZa96aSNoILIo5nCchbX3aNwsuGrY9mr2USTv2f9GVk/xot4QHXpLflTvpyK67Nf2uSM1LBR7ub0rtyQOBiagvj/3lChhd2ZPic5/utsP+KRL/uPrSBypOLNfYl/quS87tNDiwkr/u/WaCtyPDdzk7rhOnUb/DpI4ILj++eQGMp5SjW4uRLFM2k4hl7vyUQ3K87hyBM1Pqh/u0jGNjsy838ktjG3z4vgVSU5kUz0uLNCnyTIIy3WV6AV7bNuO/2Qucy7govo2MsIh90rAsWkwV9Jna+x4rykOl4oDRVpEaqMjw0NvqXw2V4YlBW22lEdJuMaaXMHZrtdfyGk4fVOVYLnRrRA4HEjvB9MfHOAxY6IO7fYZlC6vJOLnMJI0HRHzTvc+mjkL00yY8JSlqL2JbQwozKEZ/jwpapWZViKl4VK33H3O/8GzlGSCldkXgTvS8IraN4wb2U92HOIPgGyHQ43bNRGsU7LCoK10G6pVeNtqlqNE9GTuNR/gpfiHIfmgnnOPDVVd+XXCh3DA3YbsGQRwoWrBRhnkJD5y8LV3p6cDkgan1J6snZBYX9Ok9DiQMjzqzPS3tge2Khj2OPyFUPIkI1TUn7RVAYAVsbhZyhAAIoQKPT1jAzzuzwueq6+ti3taUAti8kvcnIf1cyGKQEp88k+FPBGwQk4RHL70+0WZkjFf/rFmbEf504cNPGGSJLksGTEpobVp92K+pWMpGMOV+5XD1UKRyt/c7MUN8B0UyYCeY9EIxFMySG7gd5LLTBSq7rJzL9BHzM/JZCCRzQ2KDP11+e9Ls6UpdKksygOGb+";

// // Fonction pour chiffrer les données
// export const encryptData = (data: unknown) => {
//   const encryptedData = CryptoJS.AES.encrypt(
//     JSON.stringify(data),
//     SECRET_KEY
//   ).toString();
//   return encryptedData;
// };

// // Fonction pour déchiffrer les données
// export const decryptData = (encryptedData: string): string => {
//   try {
//     const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
//     const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
//     if (!decryptedData) {
//       throw new Error("Decryption failed");
//     }
//     return decryptedData;
//   } catch (error) {
//     console.error("Erreur de déchiffrement", error);
//     throw error;
//   }
// };
