/**
 * Simple dependency injection container for CLI services
 */
export class ServiceContainer {
  private services = new Map<string, any>()
  
  register<T>(key: string, instance: T): void {
    this.services.set(key, instance)
  }
  
  get<T>(key: string): T {
    const service = this.services.get(key)
    if (!service) {
      throw new Error(`Service '${key}' not found in container`)
    }
    return service
  }
  
  has(key: string): boolean {
    return this.services.has(key)
  }
  
  /**
   * Creates a container with all default services registered
   */
  static async create(): Promise<ServiceContainer> {
    const container = new ServiceContainer()
    
    // Import services dynamically to avoid circular deps
    const { StubGenerator } = await import('../generators/stub_generator.js')
    const { ProjectDetector } = await import('../utils/project_detector.js')
    
    container.register('stubGenerator', new StubGenerator())
    container.register('projectDetector', new ProjectDetector())
    
    return container
  }
}