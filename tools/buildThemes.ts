#!/usr/bin/env tsx
/**
 * Build script to generate VS Code theme JSON files from TypeScript definitions.
 * Automatically discovers and builds all themes in src/themes/.
 * Cleans themes folder before generating and updates package.json.
 *
 * Run: npx tsx tools/buildThemes.ts
 */

import { mkdir, readdir, readFile, rm, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { MorrocoyTheme } from '../lib/MorrocoyTheme';

const __dirname = dirname(fileURLToPath(import.meta.url));
const themesDir = join(__dirname, '../src/themes');
const outputDir = join(__dirname, '../themes');
const packageJsonPath = join(__dirname, '../package.json');

interface PackageJson {
  contributes?: {
    themes?: Array<{
      label: string;
      uiTheme: 'vs' | 'vs-dark';
      path: string;
    }>;
  };
  [key: string]: unknown;
}

async function cleanThemesFolder(): Promise<void> {
  console.log('Cleaning themes folder...');

  try {
    const files = await readdir(outputDir);
    const jsonFiles = files.filter((f) => f.endsWith('.json'));

    for (const file of jsonFiles) {
      await rm(join(outputDir, file));
      console.log(`  Removed ${file}`);
    }

    if (jsonFiles.length === 0) {
      console.log('  No files to remove');
    }
  } catch (error) {
    // Folder might not exist yet
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
    console.log('  Themes folder does not exist yet');
  }
}

async function discoverThemes(): Promise<MorrocoyTheme[]> {
  const files = await readdir(themesDir);
  const themeFiles = files.filter(
    (f) => f.endsWith('.ts') && !f.endsWith('.test.ts') && !f.endsWith('.d.ts')
  );

  const themes: MorrocoyTheme[] = [];

  for (const file of themeFiles) {
    const modulePath = join(themesDir, file);
    const module = await import(modulePath);

    // Find exported MorrocoyTheme instances
    for (const [exportName, exportValue] of Object.entries(module)) {
      if (exportValue instanceof MorrocoyTheme) {
        themes.push(exportValue);
        console.log(`  Found theme: ${exportName} in ${file}`);
      }
    }
  }

  return themes;
}

async function updatePackageJson(themes: MorrocoyTheme[]): Promise<void> {
  console.log('Updating package.json...');

  const packageJsonContent = await readFile(packageJsonPath, 'utf-8');
  const packageJson: PackageJson = JSON.parse(packageJsonContent);

  // Build the themes array for package.json
  const themesConfig = themes.map((theme) => ({
    label: theme.name,
    uiTheme: theme.uiTheme,
    path: `./themes/${theme.fileName}`,
  }));

  // Ensure contributes exists
  if (!packageJson.contributes) {
    packageJson.contributes = {};
  }

  // Update the themes
  packageJson.contributes.themes = themesConfig;

  // Write back with proper formatting
  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8');

  console.log(`  Updated with ${themes.length} theme(s)`);
  for (const theme of themes) {
    console.log(`    - ${theme.name} (${theme.type})`);
  }
}

async function main() {
  console.log('Building VS Code themes...\n');

  // Step 1: Clean the themes folder
  await cleanThemesFolder();
  console.log('');

  // Step 2: Discover themes
  console.log('Discovering themes in src/themes/...');
  const themes = await discoverThemes();

  if (themes.length === 0) {
    console.log('\nNo themes found. Make sure your theme files export a MorrocoyTheme instance.');
    return;
  }

  console.log('');

  // Step 3: Ensure output directory exists
  await mkdir(outputDir, { recursive: true });

  // Step 4: Generate theme files
  for (const theme of themes) {
    const outputPath = join(outputDir, theme.fileName);
    const json = theme.toString();

    await writeFile(outputPath, json, 'utf-8');
    console.log(`✓ Generated ${theme.fileName}`);
    console.log(`  Name: ${theme.name}`);
    console.log(`  Type: ${theme.type}`);
    console.log(`  Path: ${outputPath}\n`);
  }

  // Step 5: Update package.json
  await updatePackageJson(themes);
  console.log('');

  console.log(`Built ${themes.length} theme(s) successfully.`);
}

main().catch(console.error);
