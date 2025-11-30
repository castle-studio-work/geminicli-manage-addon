import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import fs from 'fs';
import path from 'path';
import os from 'os';

const GEMINI_DIR = path.join(os.homedir(), '.gemini');
const EXTENSIONS_DIR = path.join(GEMINI_DIR, 'extensions');
const EXTENSION_ENABLEMENT_PATH = path.join(EXTENSIONS_DIR, 'extension-enablement.json');
const MCP_ENABLEMENT_PATH = path.join(EXTENSIONS_DIR, 'mcp-server-enablement.json');
const SETTINGS_PATH = path.join(GEMINI_DIR, 'settings.json');

const ListItem = ({ text, isEnabled, isSelected, indent = 0 }) => {
    return React.createElement(Box, null,
        React.createElement(Text, { color: isSelected ? 'green' : 'white' },
            isSelected ? '> ' : '  ',
            '  '.repeat(indent)
        ),
        React.createElement(Text, { color: isEnabled ? 'green' : 'gray' },
            `[${isEnabled ? 'x' : ' '}] ${text}`
        )
    );
};

const App = () => {
    const { exit } = useApp();
    const [extensionConfig, setExtensionConfig] = useState({});
    const [mcpConfig, setMcpConfig] = useState({});
    const [settings, setSettings] = useState({});
    const [items, setItems] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [status, setStatus] = useState('Loading...');

    useEffect(() => {
        try {
            // Load extension enablement
            let extConfig = {};
            if (fs.existsSync(EXTENSION_ENABLEMENT_PATH)) {
                const data = fs.readFileSync(EXTENSION_ENABLEMENT_PATH, 'utf8');
                extConfig = JSON.parse(data);
                setExtensionConfig(extConfig);
            }

            // Load or create MCP enablement
            let mcpData = {};
            if (fs.existsSync(MCP_ENABLEMENT_PATH)) {
                const data = fs.readFileSync(MCP_ENABLEMENT_PATH, 'utf8');
                mcpData = JSON.parse(data);
            }

            // Load settings.json
            let settingsData = {};
            if (fs.existsSync(SETTINGS_PATH)) {
                const data = fs.readFileSync(SETTINGS_PATH, 'utf8');
                settingsData = JSON.parse(data);
                setSettings(settingsData);
            }

            // Build items list
            const itemsList = [];
            const extensions = Object.keys(extConfig);

            // Add extensions and their MCP servers
            extensions.forEach(extName => {
                itemsList.push({
                    type: 'extension',
                    name: extName,
                    indent: 0
                });

                const extPath = path.join(EXTENSIONS_DIR, extName, 'gemini-extension.json');
                if (fs.existsSync(extPath)) {
                    try {
                        const extData = JSON.parse(fs.readFileSync(extPath, 'utf8'));
                        if (extData.mcpServers) {
                            Object.keys(extData.mcpServers).forEach(mcpName => {
                                itemsList.push({
                                    type: 'mcp',
                                    extension: extName,
                                    name: mcpName,
                                    indent: 1
                                });

                                if (!mcpData[extName]) {
                                    mcpData[extName] = {};
                                }
                                if (mcpData[extName][mcpName] === undefined) {
                                    mcpData[extName][mcpName] = true;
                                }
                            });
                        }
                    } catch (err) {
                        // Skip if can't read extension config
                    }
                }
            });

            // Add separator
            if (itemsList.length > 0 && settingsData.mcpServers && Object.keys(settingsData.mcpServers).length > 0) {
                itemsList.push({
                    type: 'separator',
                    name: '--- Standalone MCP Servers ---',
                    indent: 0
                });
            }

            // Add standalone MCP servers from settings.json
            if (settingsData.mcpServers) {
                Object.keys(settingsData.mcpServers).forEach(mcpName => {
                    itemsList.push({
                        type: 'standalone-mcp',
                        name: mcpName,
                        indent: 0
                    });
                });
            }

            setItems(itemsList);
            setMcpConfig(mcpData);
            setStatus('Ready. Use arrow keys to navigate, Space to toggle, Enter to save & exit.');
        } catch (err) {
            setStatus(`Error loading config: ${err.message}`);
        }
    }, []);

    const getItemEnabled = (item) => {
        if (item.type === 'extension') {
            const overrides = extensionConfig[item.name]?.overrides || [];
            const userPattern = `/Users/${os.userInfo().username}/*`;
            const disabledPattern = `!${userPattern}`;
            return overrides.includes(userPattern) && !overrides.includes(disabledPattern);
        } else if (item.type === 'mcp') {
            return mcpConfig[item.extension]?.[item.name] !== false;
        } else if (item.type === 'standalone-mcp') {
            const excluded = settings.mcp?.excluded || [];
            return !excluded.includes(item.name);
        }
        return false;
    };

    const toggleItem = (item) => {
        if (item.type === 'extension') {
            const newConfig = { ...extensionConfig };
            const currentOverrides = newConfig[item.name]?.overrides || [];
            const userPattern = `/Users/${os.userInfo().username}/*`;
            const disabledPattern = `!${userPattern}`;
            const isCurrentlyDisabled = currentOverrides.includes(disabledPattern);

            let newOverrides;
            if (isCurrentlyDisabled) {
                newOverrides = currentOverrides.filter(p => p !== disabledPattern);
                if (!newOverrides.includes(userPattern)) {
                    newOverrides.push(userPattern);
                }
            } else {
                newOverrides = currentOverrides.filter(p => p !== userPattern);
                if (!newOverrides.includes(disabledPattern)) {
                    newOverrides.push(disabledPattern);
                }
            }

            newConfig[item.name] = { ...newConfig[item.name], overrides: newOverrides };
            setExtensionConfig(newConfig);
        } else if (item.type === 'mcp') {
            const newMcpConfig = { ...mcpConfig };
            if (!newMcpConfig[item.extension]) {
                newMcpConfig[item.extension] = {};
            }
            const currentValue = newMcpConfig[item.extension][item.name];
            newMcpConfig[item.extension][item.name] = !currentValue;
            setMcpConfig(newMcpConfig);
        } else if (item.type === 'standalone-mcp') {
            const newSettings = { ...settings };
            if (!newSettings.mcp) {
                newSettings.mcp = {};
            }
            if (!newSettings.mcp.excluded) {
                newSettings.mcp.excluded = [];
            }

            const excluded = [...newSettings.mcp.excluded];
            const index = excluded.indexOf(item.name);

            if (index > -1) {
                // Currently excluded (disabled), remove from list to enable
                excluded.splice(index, 1);
            } else {
                // Currently enabled, add to excluded list to disable
                excluded.push(item.name);
            }

            newSettings.mcp.excluded = excluded;
            setSettings(newSettings);
        }
    };

    const saveAndExit = () => {
        try {
            // Backup and save extension config
            fs.copyFileSync(EXTENSION_ENABLEMENT_PATH, `${EXTENSION_ENABLEMENT_PATH}.bak`);
            fs.writeFileSync(EXTENSION_ENABLEMENT_PATH, JSON.stringify(extensionConfig, null, 2));

            // Save MCP config
            fs.writeFileSync(MCP_ENABLEMENT_PATH, JSON.stringify(mcpConfig, null, 2));

            // Backup and save settings.json
            fs.copyFileSync(SETTINGS_PATH, `${SETTINGS_PATH}.bak`);
            fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));

            exit();
        } catch (err) {
            setStatus(`Error saving: ${err.message}`);
        }
    };

    useInput((input, key) => {
        if (key.upArrow) {
            let newIndex = selectedIndex - 1;
            // Skip separator
            while (newIndex >= 0 && items[newIndex]?.type === 'separator') {
                newIndex--;
            }
            setSelectedIndex(Math.max(0, newIndex));
        }
        if (key.downArrow) {
            let newIndex = selectedIndex + 1;
            // Skip separator
            while (newIndex < items.length && items[newIndex]?.type === 'separator') {
                newIndex++;
            }
            setSelectedIndex(Math.min(items.length - 1, newIndex));
        }
        if (input === ' ') {
            const item = items[selectedIndex];
            if (item && item.type !== 'separator') {
                toggleItem(item);
            }
        }
        if (key.return) {
            saveAndExit();
        }
        if (key.escape) {
            exit();
        }
    });

    return React.createElement(Box, { flexDirection: 'column', padding: 1 },
        React.createElement(Text, { bold: true }, 'Geminicli Extension & MCP Server Manager'),
        React.createElement(Box, { flexDirection: 'column', marginY: 1 },
            items.map((item, index) => {
                if (item.type === 'separator') {
                    return React.createElement(Text, {
                        key: `separator-${index}`,
                        color: 'cyan',
                        bold: true
                    }, item.name);
                }

                const isEnabled = getItemEnabled(item);
                let displayName = item.name;

                if (item.type === 'mcp') {
                    displayName = `${item.name} (MCP Server)`;
                } else if (item.type === 'standalone-mcp') {
                    displayName = `${item.name} (Standalone)`;
                }

                return React.createElement(ListItem, {
                    key: `${item.type}-${item.extension || ''}-${item.name}`,
                    text: displayName,
                    isEnabled: isEnabled,
                    isSelected: index === selectedIndex,
                    indent: item.indent
                });
            })
        ),
        React.createElement(Text, { color: 'gray' }, status)
    );
};

export default App;
