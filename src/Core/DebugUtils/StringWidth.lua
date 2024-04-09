

------------------------
----| String Width |----
------------------------

--[[
    offers functions to measure the width of a string (i.e. the space it takes on screen, not the number of chars). Wc3 font is not monospace, so the system below has protocolled every char width and simply sums up all chars in a string.
    output measures are:
    1. Multiboard-width (i.e. 1-based screen share used in Multiboards column functions)
    2. Line-width for screen prints
    every unknown char will be treated as having default width (see constants below)
--]]

do
    ----------------------------
    ----| String Width API |----
    ----------------------------

    local multiboardCharTable = {}                        ---@type table  -- saves the width in screen percent (on 1920 pixel width resolutions) that each char takes up, when displayed in a multiboard.
    local DEFAULT_MULTIBOARD_CHAR_WIDTH = 1. / 128.        ---@type number    -- used for unknown chars (where we didn't define a width in the char table)
    local MULTIBOARD_TO_PRINT_FACTOR = 1. / 36.            ---@type number    -- 36 is actually the lower border (longest width of a non-breaking string only consisting of the letter "i")

    ---Returns the width of a char in a multiboard, when inputting a char (string of length 1) and 0 otherwise.
    ---also returns 0 for non-recorded chars (like ` and ´ and ß and § and €)
    ---@param char string | integer integer bytecode representations of chars are also allowed, i.e. the results of string.byte().
    ---@param textlanguage? '"ger"'| '"eng"' (default: 'eng'), depending on the text language in the Warcraft 3 installation settings.
    ---@return number
    function string.charMultiboardWidth(char, textlanguage)
        return multiboardCharTable[textlanguage or 'eng'][char] or DEFAULT_MULTIBOARD_CHAR_WIDTH
    end

    ---returns the width of a string in a multiboard (i.e. output is in screen percent)
    ---unknown chars will be measured with default width (see constants above)
    ---@param multichar string
    ---@param textlanguage? '"ger"'| '"eng"' (default: 'eng'), depending on the text language in the Warcraft 3 installation settings.
    ---@return number
    function string.multiboardWidth(multichar, textlanguage)
        local chartable = table.pack(multichar:byte(1,-1)) --packs all bytecode char representations into a table
        local charWidth = 0.
        for i = 1, chartable.n do
            charWidth = charWidth + string.charMultiboardWidth(chartable[i], textlanguage)
        end
        return charWidth
    end

    ---The function should match the following criteria: If the value returned by this function is smaller than 1.0, than the string fits into a single line on screen.
    ---The opposite is not necessarily true (but should be true in the majority of cases): If the function returns bigger than 1.0, the string doesn't necessarily break.
    ---@param char string | integer integer bytecode representations of chars are also allowed, i.e. the results of string.byte().
    ---@param textlanguage? '"ger"'| '"eng"' (default: 'eng'), depending on the text language in the Warcraft 3 installation settings.
    ---@return number
    function string.charPrintWidth(char, textlanguage)
        return string.charMultiboardWidth(char, textlanguage) * MULTIBOARD_TO_PRINT_FACTOR
    end

    ---The function should match the following criteria: If the value returned by this function is smaller than 1.0, than the string fits into a single line on screen.
    ---The opposite is not necessarily true (but should be true in the majority of cases): If the function returns bigger than 1.0, the string doesn't necessarily break.
    ---@param multichar string
    ---@param textlanguage? '"ger"'| '"eng"' (default: 'eng'), depending on the text language in the Warcraft 3 installation settings.
    ---@return number
    function string.printWidth(multichar, textlanguage)
        return string.multiboardWidth(multichar, textlanguage) * MULTIBOARD_TO_PRINT_FACTOR
    end

    ----------------------------------
    ----| String Width Internals |----
    ----------------------------------

    ---@param charset '"ger"'| '"eng"' (default: 'eng'), depending on the text language in the Warcraft 3 installation settings.
    ---@param char string|integer either the char or its bytecode
    ---@param lengthInScreenWidth number
    local function setMultiboardCharWidth(charset, char, lengthInScreenWidth)
        multiboardCharTable[charset] = multiboardCharTable[charset] or {}
        multiboardCharTable[charset][char] = lengthInScreenWidth
    end

    ---numberPlacements says how often the char can be placed in a multiboard column, before reaching into the right bound.
    ---@param charset '"ger"'| '"eng"' (default: 'eng'), depending on the text language in the Warcraft 3 installation settings.
    ---@param char string|integer either the char or its bytecode
    ---@param numberPlacements integer
    local function setMultiboardCharWidthBase80(charset, char, numberPlacements)
        setMultiboardCharWidth(charset, char, 0.8 / numberPlacements) --1-based measure. 80./numberPlacements would result in Screen Percent.
        setMultiboardCharWidth(charset, char:byte(1,-1), 0.8 / numberPlacements)
    end

    -- Set Char Width for all printable ascii chars in screen width (1920 pixels). Measured on a 80percent screen width multiboard column by counting the number of chars that fit into it.
    -- Font size differs by text install language and patch (1.32- vs. 1.33+)
    if BlzGetUnitOrderCount then --identifies patch 1.33+
        --German font size for patch 1.33+
        setMultiboardCharWidthBase80('ger', "a", 144)
        setMultiboardCharWidthBase80('ger', "b", 131)
        setMultiboardCharWidthBase80('ger', "c", 144)
        setMultiboardCharWidthBase80('ger', "d", 120)
        setMultiboardCharWidthBase80('ger', "e", 131)
        setMultiboardCharWidthBase80('ger', "f", 240)
        setMultiboardCharWidthBase80('ger', "g", 120)
        setMultiboardCharWidthBase80('ger', "h", 131)
        setMultiboardCharWidthBase80('ger', "i", 288)
        setMultiboardCharWidthBase80('ger', "j", 288)
        setMultiboardCharWidthBase80('ger', "k", 144)
        setMultiboardCharWidthBase80('ger', "l", 288)
        setMultiboardCharWidthBase80('ger', "m", 85)
        setMultiboardCharWidthBase80('ger', "n", 131)
        setMultiboardCharWidthBase80('ger', "o", 120)
        setMultiboardCharWidthBase80('ger', "p", 120)
        setMultiboardCharWidthBase80('ger', "q", 120)
        setMultiboardCharWidthBase80('ger', "r", 206)
        setMultiboardCharWidthBase80('ger', "s", 160)
        setMultiboardCharWidthBase80('ger', "t", 206)
        setMultiboardCharWidthBase80('ger', "u", 131)
        setMultiboardCharWidthBase80('ger', "v", 131)
        setMultiboardCharWidthBase80('ger', "w", 96)
        setMultiboardCharWidthBase80('ger', "x", 144)
        setMultiboardCharWidthBase80('ger', "y", 131)
        setMultiboardCharWidthBase80('ger', "z", 144)
        setMultiboardCharWidthBase80('ger', "A", 103)
        setMultiboardCharWidthBase80('ger', "B", 120)
        setMultiboardCharWidthBase80('ger', "C", 111)
        setMultiboardCharWidthBase80('ger', "D", 103)
        setMultiboardCharWidthBase80('ger', "E", 144)
        setMultiboardCharWidthBase80('ger', "F", 160)
        setMultiboardCharWidthBase80('ger', "G", 96)
        setMultiboardCharWidthBase80('ger', "H", 96)
        setMultiboardCharWidthBase80('ger', "I", 240)
        setMultiboardCharWidthBase80('ger', "J", 240)
        setMultiboardCharWidthBase80('ger', "K", 120)
        setMultiboardCharWidthBase80('ger', "L", 144)
        setMultiboardCharWidthBase80('ger', "M", 76)
        setMultiboardCharWidthBase80('ger', "N", 96)
        setMultiboardCharWidthBase80('ger', "O", 90)
        setMultiboardCharWidthBase80('ger', "P", 131)
        setMultiboardCharWidthBase80('ger', "Q", 90)
        setMultiboardCharWidthBase80('ger', "R", 120)
        setMultiboardCharWidthBase80('ger', "S", 131)
        setMultiboardCharWidthBase80('ger', "T", 144)
        setMultiboardCharWidthBase80('ger', "U", 103)
        setMultiboardCharWidthBase80('ger', "V", 120)
        setMultiboardCharWidthBase80('ger', "W", 76)
        setMultiboardCharWidthBase80('ger', "X", 111)
        setMultiboardCharWidthBase80('ger', "Y", 120)
        setMultiboardCharWidthBase80('ger', "Z", 120)
        setMultiboardCharWidthBase80('ger', "1", 144)
        setMultiboardCharWidthBase80('ger', "2", 120)
        setMultiboardCharWidthBase80('ger', "3", 120)
        setMultiboardCharWidthBase80('ger', "4", 120)
        setMultiboardCharWidthBase80('ger', "5", 120)
        setMultiboardCharWidthBase80('ger', "6", 120)
        setMultiboardCharWidthBase80('ger', "7", 131)
        setMultiboardCharWidthBase80('ger', "8", 120)
        setMultiboardCharWidthBase80('ger', "9", 120)
        setMultiboardCharWidthBase80('ger', "0", 120)
        setMultiboardCharWidthBase80('ger', ":", 288)
        setMultiboardCharWidthBase80('ger', ";", 288)
        setMultiboardCharWidthBase80('ger', ".", 288)
        setMultiboardCharWidthBase80('ger', "#", 120)
        setMultiboardCharWidthBase80('ger', ",", 288)
        setMultiboardCharWidthBase80('ger', " ", 286) --space
        setMultiboardCharWidthBase80('ger', "'", 180)
        setMultiboardCharWidthBase80('ger', "!", 180)
        setMultiboardCharWidthBase80('ger', "$", 131)
        setMultiboardCharWidthBase80('ger', "&", 90)
        setMultiboardCharWidthBase80('ger', "/", 180)
        setMultiboardCharWidthBase80('ger', "(", 240)
        setMultiboardCharWidthBase80('ger', ")", 240)
        setMultiboardCharWidthBase80('ger', "=", 120)
        setMultiboardCharWidthBase80('ger', "?", 144)
        setMultiboardCharWidthBase80('ger', "^", 144)
        setMultiboardCharWidthBase80('ger', "<", 144)
        setMultiboardCharWidthBase80('ger', ">", 144)
        setMultiboardCharWidthBase80('ger', "-", 180)
        setMultiboardCharWidthBase80('ger', "+", 120)
        setMultiboardCharWidthBase80('ger', "*", 180)
        setMultiboardCharWidthBase80('ger', "|", 287) --2 vertical bars in a row escape to one. So you could print 960 ones in a line, 480 would display. Maybe need to adapt to this before calculating string width.
        setMultiboardCharWidthBase80('ger', "~", 111)
        setMultiboardCharWidthBase80('ger', "{", 240)
        setMultiboardCharWidthBase80('ger', "}", 240)
        setMultiboardCharWidthBase80('ger', "[", 240)
        setMultiboardCharWidthBase80('ger', "]", 240)
        setMultiboardCharWidthBase80('ger', "_", 144)
        setMultiboardCharWidthBase80('ger', "\x25", 103) --percent
        setMultiboardCharWidthBase80('ger', "\x5C", 205) --backslash
        setMultiboardCharWidthBase80('ger', "\x22", 120) --double quotation mark
        setMultiboardCharWidthBase80('ger', "\x40", 90) --at sign
        setMultiboardCharWidthBase80('ger', "\x60", 144) --Gravis (Accent)

        --English font size for patch 1.33+
        setMultiboardCharWidthBase80('eng', "a", 144)
        setMultiboardCharWidthBase80('eng', "b", 120)
        setMultiboardCharWidthBase80('eng', "c", 131)
        setMultiboardCharWidthBase80('eng', "d", 120)
        setMultiboardCharWidthBase80('eng', "e", 120)
        setMultiboardCharWidthBase80('eng', "f", 240)
        setMultiboardCharWidthBase80('eng', "g", 120)
        setMultiboardCharWidthBase80('eng', "h", 120)
        setMultiboardCharWidthBase80('eng', "i", 288)
        setMultiboardCharWidthBase80('eng', "j", 288)
        setMultiboardCharWidthBase80('eng', "k", 144)
        setMultiboardCharWidthBase80('eng', "l", 288)
        setMultiboardCharWidthBase80('eng', "m", 80)
        setMultiboardCharWidthBase80('eng', "n", 120)
        setMultiboardCharWidthBase80('eng', "o", 111)
        setMultiboardCharWidthBase80('eng', "p", 111)
        setMultiboardCharWidthBase80('eng', "q", 111)
        setMultiboardCharWidthBase80('eng', "r", 206)
        setMultiboardCharWidthBase80('eng', "s", 160)
        setMultiboardCharWidthBase80('eng', "t", 206)
        setMultiboardCharWidthBase80('eng', "u", 120)
        setMultiboardCharWidthBase80('eng', "v", 144)
        setMultiboardCharWidthBase80('eng', "w", 90)
        setMultiboardCharWidthBase80('eng', "x", 131)
        setMultiboardCharWidthBase80('eng', "y", 144)
        setMultiboardCharWidthBase80('eng', "z", 144)
        setMultiboardCharWidthBase80('eng', "A", 103)
        setMultiboardCharWidthBase80('eng', "B", 120)
        setMultiboardCharWidthBase80('eng', "C", 103)
        setMultiboardCharWidthBase80('eng', "D", 96)
        setMultiboardCharWidthBase80('eng', "E", 131)
        setMultiboardCharWidthBase80('eng', "F", 160)
        setMultiboardCharWidthBase80('eng', "G", 96)
        setMultiboardCharWidthBase80('eng', "H", 90)
        setMultiboardCharWidthBase80('eng', "I", 240)
        setMultiboardCharWidthBase80('eng', "J", 240)
        setMultiboardCharWidthBase80('eng', "K", 120)
        setMultiboardCharWidthBase80('eng', "L", 131)
        setMultiboardCharWidthBase80('eng', "M", 76)
        setMultiboardCharWidthBase80('eng', "N", 90)
        setMultiboardCharWidthBase80('eng', "O", 85)
        setMultiboardCharWidthBase80('eng', "P", 120)
        setMultiboardCharWidthBase80('eng', "Q", 85)
        setMultiboardCharWidthBase80('eng', "R", 120)
        setMultiboardCharWidthBase80('eng', "S", 131)
        setMultiboardCharWidthBase80('eng', "T", 144)
        setMultiboardCharWidthBase80('eng', "U", 96)
        setMultiboardCharWidthBase80('eng', "V", 120)
        setMultiboardCharWidthBase80('eng', "W", 76)
        setMultiboardCharWidthBase80('eng', "X", 111)
        setMultiboardCharWidthBase80('eng', "Y", 120)
        setMultiboardCharWidthBase80('eng', "Z", 111)
        setMultiboardCharWidthBase80('eng', "1", 103)
        setMultiboardCharWidthBase80('eng', "2", 111)
        setMultiboardCharWidthBase80('eng', "3", 111)
        setMultiboardCharWidthBase80('eng', "4", 111)
        setMultiboardCharWidthBase80('eng', "5", 111)
        setMultiboardCharWidthBase80('eng', "6", 111)
        setMultiboardCharWidthBase80('eng', "7", 111)
        setMultiboardCharWidthBase80('eng', "8", 111)
        setMultiboardCharWidthBase80('eng', "9", 111)
        setMultiboardCharWidthBase80('eng', "0", 111)
        setMultiboardCharWidthBase80('eng', ":", 288)
        setMultiboardCharWidthBase80('eng', ";", 288)
        setMultiboardCharWidthBase80('eng', ".", 288)
        setMultiboardCharWidthBase80('eng', "#", 103)
        setMultiboardCharWidthBase80('eng', ",", 288)
        setMultiboardCharWidthBase80('eng', " ", 286) --space
        setMultiboardCharWidthBase80('eng', "'", 360)
        setMultiboardCharWidthBase80('eng', "!", 288)
        setMultiboardCharWidthBase80('eng', "$", 131)
        setMultiboardCharWidthBase80('eng', "&", 120)
        setMultiboardCharWidthBase80('eng', "/", 180)
        setMultiboardCharWidthBase80('eng', "(", 206)
        setMultiboardCharWidthBase80('eng', ")", 206)
        setMultiboardCharWidthBase80('eng', "=", 111)
        setMultiboardCharWidthBase80('eng', "?", 180)
        setMultiboardCharWidthBase80('eng', "^", 144)
        setMultiboardCharWidthBase80('eng', "<", 111)
        setMultiboardCharWidthBase80('eng', ">", 111)
        setMultiboardCharWidthBase80('eng', "-", 160)
        setMultiboardCharWidthBase80('eng', "+", 111)
        setMultiboardCharWidthBase80('eng', "*", 144)
        setMultiboardCharWidthBase80('eng', "|", 479) --2 vertical bars in a row escape to one. So you could print 960 ones in a line, 480 would display. Maybe need to adapt to this before calculating string width.
        setMultiboardCharWidthBase80('eng', "~", 144)
        setMultiboardCharWidthBase80('eng', "{", 160)
        setMultiboardCharWidthBase80('eng', "}", 160)
        setMultiboardCharWidthBase80('eng', "[", 206)
        setMultiboardCharWidthBase80('eng', "]", 206)
        setMultiboardCharWidthBase80('eng', "_", 120)
        setMultiboardCharWidthBase80('eng', "\x25", 103) --percent
        setMultiboardCharWidthBase80('eng', "\x5C", 180) --backslash
        setMultiboardCharWidthBase80('eng', "\x22", 180) --double quotation mark
        setMultiboardCharWidthBase80('eng', "\x40", 85) --at sign
        setMultiboardCharWidthBase80('eng', "\x60", 206) --Gravis (Accent)
    else
        --German font size up to patch 1.32
        setMultiboardCharWidthBase80('ger', "a", 144)
        setMultiboardCharWidthBase80('ger', "b", 144)
        setMultiboardCharWidthBase80('ger', "c", 144)
        setMultiboardCharWidthBase80('ger', "d", 131)
        setMultiboardCharWidthBase80('ger', "e", 144)
        setMultiboardCharWidthBase80('ger', "f", 240)
        setMultiboardCharWidthBase80('ger', "g", 120)
        setMultiboardCharWidthBase80('ger', "h", 144)
        setMultiboardCharWidthBase80('ger', "i", 360)
        setMultiboardCharWidthBase80('ger', "j", 288)
        setMultiboardCharWidthBase80('ger', "k", 144)
        setMultiboardCharWidthBase80('ger', "l", 360)
        setMultiboardCharWidthBase80('ger', "m", 90)
        setMultiboardCharWidthBase80('ger', "n", 144)
        setMultiboardCharWidthBase80('ger', "o", 131)
        setMultiboardCharWidthBase80('ger', "p", 131)
        setMultiboardCharWidthBase80('ger', "q", 131)
        setMultiboardCharWidthBase80('ger', "r", 206)
        setMultiboardCharWidthBase80('ger', "s", 180)
        setMultiboardCharWidthBase80('ger', "t", 206)
        setMultiboardCharWidthBase80('ger', "u", 144)
        setMultiboardCharWidthBase80('ger', "v", 131)
        setMultiboardCharWidthBase80('ger', "w", 96)
        setMultiboardCharWidthBase80('ger', "x", 144)
        setMultiboardCharWidthBase80('ger', "y", 131)
        setMultiboardCharWidthBase80('ger', "z", 144)
        setMultiboardCharWidthBase80('ger', "A", 103)
        setMultiboardCharWidthBase80('ger', "B", 131)
        setMultiboardCharWidthBase80('ger', "C", 120)
        setMultiboardCharWidthBase80('ger', "D", 111)
        setMultiboardCharWidthBase80('ger', "E", 144)
        setMultiboardCharWidthBase80('ger', "F", 180)
        setMultiboardCharWidthBase80('ger', "G", 103)
        setMultiboardCharWidthBase80('ger', "H", 103)
        setMultiboardCharWidthBase80('ger', "I", 288)
        setMultiboardCharWidthBase80('ger', "J", 240)
        setMultiboardCharWidthBase80('ger', "K", 120)
        setMultiboardCharWidthBase80('ger', "L", 144)
        setMultiboardCharWidthBase80('ger', "M", 80)
        setMultiboardCharWidthBase80('ger', "N", 103)
        setMultiboardCharWidthBase80('ger', "O", 96)
        setMultiboardCharWidthBase80('ger', "P", 144)
        setMultiboardCharWidthBase80('ger', "Q", 90)
        setMultiboardCharWidthBase80('ger', "R", 120)
        setMultiboardCharWidthBase80('ger', "S", 144)
        setMultiboardCharWidthBase80('ger', "T", 144)
        setMultiboardCharWidthBase80('ger', "U", 111)
        setMultiboardCharWidthBase80('ger', "V", 120)
        setMultiboardCharWidthBase80('ger', "W", 76)
        setMultiboardCharWidthBase80('ger', "X", 111)
        setMultiboardCharWidthBase80('ger', "Y", 120)
        setMultiboardCharWidthBase80('ger', "Z", 120)
        setMultiboardCharWidthBase80('ger', "1", 288)
        setMultiboardCharWidthBase80('ger', "2", 131)
        setMultiboardCharWidthBase80('ger', "3", 144)
        setMultiboardCharWidthBase80('ger', "4", 120)
        setMultiboardCharWidthBase80('ger', "5", 144)
        setMultiboardCharWidthBase80('ger', "6", 131)
        setMultiboardCharWidthBase80('ger', "7", 144)
        setMultiboardCharWidthBase80('ger', "8", 131)
        setMultiboardCharWidthBase80('ger', "9", 131)
        setMultiboardCharWidthBase80('ger', "0", 131)
        setMultiboardCharWidthBase80('ger', ":", 480)
        setMultiboardCharWidthBase80('ger', ";", 360)
        setMultiboardCharWidthBase80('ger', ".", 480)
        setMultiboardCharWidthBase80('ger', "#", 120)
        setMultiboardCharWidthBase80('ger', ",", 360)
        setMultiboardCharWidthBase80('ger', " ", 288) --space
        setMultiboardCharWidthBase80('ger', "'", 480)
        setMultiboardCharWidthBase80('ger', "!", 360)
        setMultiboardCharWidthBase80('ger', "$", 160)
        setMultiboardCharWidthBase80('ger', "&", 96)
        setMultiboardCharWidthBase80('ger', "/", 180)
        setMultiboardCharWidthBase80('ger', "(", 288)
        setMultiboardCharWidthBase80('ger', ")", 288)
        setMultiboardCharWidthBase80('ger', "=", 160)
        setMultiboardCharWidthBase80('ger', "?", 180)
        setMultiboardCharWidthBase80('ger', "^", 144)
        setMultiboardCharWidthBase80('ger', "<", 160)
        setMultiboardCharWidthBase80('ger', ">", 160)
        setMultiboardCharWidthBase80('ger', "-", 144)
        setMultiboardCharWidthBase80('ger', "+", 160)
        setMultiboardCharWidthBase80('ger', "*", 206)
        setMultiboardCharWidthBase80('ger', "|", 480) --2 vertical bars in a row escape to one. So you could print 960 ones in a line, 480 would display. Maybe need to adapt to this before calculating string width.
        setMultiboardCharWidthBase80('ger', "~", 144)
        setMultiboardCharWidthBase80('ger', "{", 240)
        setMultiboardCharWidthBase80('ger', "}", 240)
        setMultiboardCharWidthBase80('ger', "[", 240)
        setMultiboardCharWidthBase80('ger', "]", 288)
        setMultiboardCharWidthBase80('ger', "_", 144)
        setMultiboardCharWidthBase80('ger', "\x25", 111) --percent
        setMultiboardCharWidthBase80('ger', "\x5C", 206) --backslash
        setMultiboardCharWidthBase80('ger', "\x22", 240) --double quotation mark
        setMultiboardCharWidthBase80('ger', "\x40", 103) --at sign
        setMultiboardCharWidthBase80('ger', "\x60", 240) --Gravis (Accent)

        --English Font size up to patch 1.32
        setMultiboardCharWidthBase80('eng', "a", 144)
        setMultiboardCharWidthBase80('eng', "b", 120)
        setMultiboardCharWidthBase80('eng', "c", 131)
        setMultiboardCharWidthBase80('eng', "d", 120)
        setMultiboardCharWidthBase80('eng', "e", 131)
        setMultiboardCharWidthBase80('eng', "f", 240)
        setMultiboardCharWidthBase80('eng', "g", 120)
        setMultiboardCharWidthBase80('eng', "h", 131)
        setMultiboardCharWidthBase80('eng', "i", 360)
        setMultiboardCharWidthBase80('eng', "j", 288)
        setMultiboardCharWidthBase80('eng', "k", 144)
        setMultiboardCharWidthBase80('eng', "l", 360)
        setMultiboardCharWidthBase80('eng', "m", 80)
        setMultiboardCharWidthBase80('eng', "n", 131)
        setMultiboardCharWidthBase80('eng', "o", 120)
        setMultiboardCharWidthBase80('eng', "p", 120)
        setMultiboardCharWidthBase80('eng', "q", 120)
        setMultiboardCharWidthBase80('eng', "r", 206)
        setMultiboardCharWidthBase80('eng', "s", 160)
        setMultiboardCharWidthBase80('eng', "t", 206)
        setMultiboardCharWidthBase80('eng', "u", 131)
        setMultiboardCharWidthBase80('eng', "v", 144)
        setMultiboardCharWidthBase80('eng', "w", 90)
        setMultiboardCharWidthBase80('eng', "x", 131)
        setMultiboardCharWidthBase80('eng', "y", 144)
        setMultiboardCharWidthBase80('eng', "z", 144)
        setMultiboardCharWidthBase80('eng', "A", 103)
        setMultiboardCharWidthBase80('eng', "B", 120)
        setMultiboardCharWidthBase80('eng', "C", 103)
        setMultiboardCharWidthBase80('eng', "D", 103)
        setMultiboardCharWidthBase80('eng', "E", 131)
        setMultiboardCharWidthBase80('eng', "F", 160)
        setMultiboardCharWidthBase80('eng', "G", 103)
        setMultiboardCharWidthBase80('eng', "H", 96)
        setMultiboardCharWidthBase80('eng', "I", 288)
        setMultiboardCharWidthBase80('eng', "J", 240)
        setMultiboardCharWidthBase80('eng', "K", 120)
        setMultiboardCharWidthBase80('eng', "L", 131)
        setMultiboardCharWidthBase80('eng', "M", 76)
        setMultiboardCharWidthBase80('eng', "N", 96)
        setMultiboardCharWidthBase80('eng', "O", 85)
        setMultiboardCharWidthBase80('eng', "P", 131)
        setMultiboardCharWidthBase80('eng', "Q", 85)
        setMultiboardCharWidthBase80('eng', "R", 120)
        setMultiboardCharWidthBase80('eng', "S", 131)
        setMultiboardCharWidthBase80('eng', "T", 144)
        setMultiboardCharWidthBase80('eng', "U", 103)
        setMultiboardCharWidthBase80('eng', "V", 120)
        setMultiboardCharWidthBase80('eng', "W", 76)
        setMultiboardCharWidthBase80('eng', "X", 111)
        setMultiboardCharWidthBase80('eng', "Y", 120)
        setMultiboardCharWidthBase80('eng', "Z", 111)
        setMultiboardCharWidthBase80('eng', "1", 206)
        setMultiboardCharWidthBase80('eng', "2", 131)
        setMultiboardCharWidthBase80('eng', "3", 131)
        setMultiboardCharWidthBase80('eng', "4", 111)
        setMultiboardCharWidthBase80('eng', "5", 131)
        setMultiboardCharWidthBase80('eng', "6", 120)
        setMultiboardCharWidthBase80('eng', "7", 131)
        setMultiboardCharWidthBase80('eng', "8", 111)
        setMultiboardCharWidthBase80('eng', "9", 120)
        setMultiboardCharWidthBase80('eng', "0", 111)
        setMultiboardCharWidthBase80('eng', ":", 360)
        setMultiboardCharWidthBase80('eng', ";", 360)
        setMultiboardCharWidthBase80('eng', ".", 360)
        setMultiboardCharWidthBase80('eng', "#", 103)
        setMultiboardCharWidthBase80('eng', ",", 360)
        setMultiboardCharWidthBase80('eng', " ", 288) --space
        setMultiboardCharWidthBase80('eng', "'", 480)
        setMultiboardCharWidthBase80('eng', "!", 360)
        setMultiboardCharWidthBase80('eng', "$", 131)
        setMultiboardCharWidthBase80('eng', "&", 120)
        setMultiboardCharWidthBase80('eng', "/", 180)
        setMultiboardCharWidthBase80('eng', "(", 240)
        setMultiboardCharWidthBase80('eng', ")", 240)
        setMultiboardCharWidthBase80('eng', "=", 111)
        setMultiboardCharWidthBase80('eng', "?", 180)
        setMultiboardCharWidthBase80('eng', "^", 144)
        setMultiboardCharWidthBase80('eng', "<", 131)
        setMultiboardCharWidthBase80('eng', ">", 131)
        setMultiboardCharWidthBase80('eng', "-", 180)
        setMultiboardCharWidthBase80('eng', "+", 111)
        setMultiboardCharWidthBase80('eng', "*", 180)
        setMultiboardCharWidthBase80('eng', "|", 480) --2 vertical bars in a row escape to one. So you could print 960 ones in a line, 480 would display. Maybe need to adapt to this before calculating string width.
        setMultiboardCharWidthBase80('eng', "~", 144)
        setMultiboardCharWidthBase80('eng', "{", 240)
        setMultiboardCharWidthBase80('eng', "}", 240)
        setMultiboardCharWidthBase80('eng', "[", 240)
        setMultiboardCharWidthBase80('eng', "]", 240)
        setMultiboardCharWidthBase80('eng', "_", 120)
        setMultiboardCharWidthBase80('eng', "\x25", 103) --percent
        setMultiboardCharWidthBase80('eng', "\x5C", 180) --backslash
        setMultiboardCharWidthBase80('eng', "\x22", 206) --double quotation mark
        setMultiboardCharWidthBase80('eng', "\x40", 96) --at sign
        setMultiboardCharWidthBase80('eng', "\x60", 206) --Gravis (Accent)
    end
end

