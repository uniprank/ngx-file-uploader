export interface FileManagerOptions {
    // for all settings (default: use url from TransferOptions) if empty
    // Path to server where the file be uploaded
    url?: string;
    // File alias default is `file`
    alias?: string;
    // An object with header informations
    headers?: object;
    // A list of data to be sent along with the files
    formData?: object;
    // Request methode (default POST) - HTML5 only
    method?: 'POST' | 'PUT' | 'PATCH';
    // Remove file from queue when upload was successfull
    removeBySuccess?: boolean;
    // Activate CORS - HTML5 only
    enableCors?: boolean;
    // With credentials
    withCredentials?: any;
}
