# DBZ Tribute Reforged
[![Build Status](https://travis-ci.com/ttay24/dbz-tribute-reforged.svg?branch=develop)](https://travis-ci.com/ttay24/dbz-tribute-reforged)
 A TypeScript repository for the Warcraft III map DBZ Tribute Reforged.

Based on the typescript template by Trigger Happy. Setup guide for wc3 TS stuff & other information on the [wiki](https://github.com/triggerhappy187/wc3-ts-template/wiki).

## Getting Started
### Requirements
1. [Node.js](https://nodejs.org/en/)
2. Warcraft III 1.31.0 or greater

### Installation
1. Clone the repository and cd to the project root.
```
git clone https://github.com/ttay24/dbz-tribute-reforged.git
cd dbz-tribute-reforged
```

2. Install the node dependencies.
```
npm install
```

3. Configure your project by editing config.json and making sure gameExecutable properly points to your game executable.
4. If you need to generate global definitions (typescript defs for the globals in the map, such as placed units, regions, etc.), then run:
```
npm run dev
```

### Install Dependencies
There are a couple things you must know if you want to install dependencies in your project.

1. If you are installing a dev dependency (TypeScriptToLua for example), you can install packages normally with npm install.
2. If you are installing a dependency that will be used in your map's source (in src-ts), you must run npm run install instead. This will keep the node_modules seperated and allows TSTL to transpile only the necessary modules. Alternatively you can cd src-ts and run npm install normally.

### Build and Test
We can build the map first to make sure there are no errors.

```
npm run build
```
When successful, the terminal output should be similar to the text below.

```
[INFO] -> building map script for map.w3x
[INFO] -> finished building map map.w3x
```

Now, we can test the map. Warcraft III should load up the map automatically after typing in the command.

```
npm run test
```
