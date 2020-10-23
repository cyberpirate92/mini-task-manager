/**
 * Descibe a property based task grouping model
 */
export interface TaskGroup {
    /**
     * Name of this task grouping model
     */
    displayName: string;
    
    /**
     * The property name which is the basis 
     * for this grouping model
     */
    propertyName: string;

    /**
     * The list of values for `propertyName` the 
     * tasks should be divided into
     */
    values: any[];

    /**
     * Display labels to be used as board titles.
     * List should have the same number of elements as `values`
     */
    displayLabels: string[];

    /**
     * Optional image urls.
     * Should have the same number of elements as `values`
     */
    displayPictures?: string[];
}