import { FileFilter } from '../source/fileFilter.core';

export interface TransferOptions {
    // Path to server where the files be uploaded
    url?: string;
    // File alias default is `file`
    alias?: string;
    // An object with header informations
    headers?: Object;
    // A list of filters which are extend the default list
    filters?: FileFilter[];
    // A list of data to be sent along with the files
    formData?: Object[];
    // Automatically upload new files when they are adding to the queue
    autoUpload?: boolean;
    // Request methode (default POST) - HTML5 only
    method?: string;
    // Remove file from queue when upload was successfull
    removeBySuccess?: boolean;
    // Limitation of files at the queue
    queueLimit?: number;
    // Activate CORS - HTML5 only
    enableCors?: boolean;
    withCredentials?: boolean;
    uniqueFiles?: boolean;
}
