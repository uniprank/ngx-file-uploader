export interface FileManagerOptionsInterface {
    // Path to server to which the file should be uploaded
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
    // if you need credentials for the communication you can activate this option here
    withCredentials?: any;
}
