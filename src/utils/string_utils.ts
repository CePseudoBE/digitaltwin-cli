/**
 * String transformation utilities for code generation
 */
export class StringUtils {
  /**
   * Convert to PascalCase (ClassNames)
   * api-collector -> ApiCollector
   */
  static toPascalCase(str: string): string {
    return str
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
  }
  
  /**
   * Convert to camelCase (variableNames)  
   * api-collector -> apiCollector
   */
  static toCamelCase(str: string): string {
    const pascal = this.toPascalCase(str)
    return pascal.charAt(0).toLowerCase() + pascal.slice(1)
  }
  
  /**
   * Convert to snake_case (file_names)
   * ApiCollector -> api_collector
   */
  static toSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '')
      .replace(/[-\s]+/g, '_')
  }
  
  /**
   * Convert to kebab-case (css-classes, endpoints)
   * ApiCollector -> api-collector
   */
  static toKebabCase(str: string): string {
    return this.toSnakeCase(str).replace(/_/g, '-')
  }
  
  /**
   * Generate all naming variants for a component
   */
  static generateNamingVariants(name: string): {
    original: string
    className: string        // PascalCase
    variableName: string     // camelCase  
    fileName: string         // snake_case
    endpoint: string         // kebab-case
  } {
    return {
      original: name,
      className: this.toPascalCase(name),
      variableName: this.toCamelCase(name),
      fileName: this.toSnakeCase(name),
      endpoint: this.toKebabCase(name)
    }
  }
}