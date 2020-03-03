import { FileFilter } from '../classes/file-filter.class';

export interface TransferOptionsInterface {
    // Path to server where the files be uploaded
    url?: string;
    // File alias default is `file`
    alias?: string;
    // An object with header informations
    headers?: object;
    // A object of data to be sent along with the files
    formData?: object;
    // Request methode (default POST) - HTML5 only
    method?: 'POST' | 'PUT' | 'PATCH';
    // Activate CORS - HTML5 only
    enableCors?: boolean;
    // if you need credentials for the communication you can activate this option here
    withCredentials?: boolean;
    // A list of filters which are extend the default list (default list is empty)
    filters?: FileFilter[];
    // Don't allow to have the same image 2 times at the queue
    uniqueFiles?: boolean;
    // Remove file from queue when upload was successfull
    removeBySuccess?: boolean;
    // Automatically upload new files when they are adding to the queue
    autoUpload?: boolean;
}
