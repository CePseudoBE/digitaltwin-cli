import { Command } from 'commander'
import { BaseMakeCommand } from './base_make_command.js'
import { StringUtils } from '../../utils/string_utils.js'
import path from 'path'

export class MakeAssetsManagerCommand extends BaseMakeCommand {
  readonly name = 'make:assets-manager'
  readonly description = 'Generate a new assets manager component'
  readonly componentType = 'AssetsManager'
  readonly stubName = 'assets_manager'
  
  setupCommand(command: Command): Command {
    return super.setupCommand(command)
      .option('-d, --description <description>', 'Description of the assets manager')
      .option('-t, --tags <tags>', 'Comma-separated tags', (value) => value.split(',').map(t => t.trim()))
      .option('--endpoint <endpoint>', 'Custom endpoint name (defaults to kebab-case of name)')
      .option('--content-type <type>', 'MIME type for the assets (e.g., image/jpeg, model/gltf-binary)', 'application/octet-stream')
  }
  
  protected async generateComponent(name: string, options: any): Promise<void> {
    const projectDetector = this.services.get('projectDetector') as any
    const stubGenerator = this.services.get('stubGenerator') as any
    
    // Validate we're in a digitaltwin project
    await projectDetector.validateProject()
    
    // Get project info
    const projectInfo = await projectDetector.getProjectInfo()
    if (!projectInfo) {
      throw new Error('Could not read project information')
    }
    
    // Prepare template data
    const templateData = {
      name,
      description: options.description || `Assets manager for ${name}`,
      tags: options.tags || [],
      endpoint: options.endpoint || StringUtils.toKebabCase(name),
      contentType: options.contentType
    }
    
    // Generate content
    const content = await stubGenerator.generate(this.stubName, templateData)
    
    // Determine file path
    const componentsDir = path.join(process.cwd(), projectInfo.srcDir, 'components')
    const fileName = `${StringUtils.toSnakeCase(name)}_assets_manager.ts`
    
    // Write file
    const filePath = await stubGenerator.writeFile(
      content, 
      fileName, 
      componentsDir,
      { force: options.force }
    )
    
    this.success(`Generated assets manager: ${path.relative(process.cwd(), filePath)}`)
    this.info(`Content type: ${options.contentType}`)
    this.info(`Assets will be available at GET /${templateData.endpoint}`)
    this.info(`Upload endpoint: POST /${templateData.endpoint}/upload`)
    this.info(`Remember to add it to your DigitalTwinEngine configuration!`)
  }
}