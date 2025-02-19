# Chess

[Click here to play!](https://abdulazizkh4tri.github.io/Chess/chess.html)

A fully functional chess game built with **JavaScript**, implementing official chess rules and mechanics.
# Features  

## You can add your own custom theme, more on that later

#### ♞ Core Gameplay  
- Full Rule Enforcement – All standard chess rules are implemented, preventing illegal moves.  
- Check, Checkmate & Stalemate Detection – Automatically identifies and enforces these game-ending states.  

#### ⚡ Special Moves  
- **En Passant** – Correctly allows and executes en passant captures.  
- Castling – Implements both kingside and queenside castling, verifying all conditions.  
- Pawn Promotion – Displays a **selection modal** for choosing between Queen, Rook, Knight, or Bishop.  

#### 📜 Move Tracking & Validation  
- **Move History** – Records each move in **standard algebraic notation**.  
- Self-Check Prevention – Disallows moves that leave the king in check.  
- Pin Detection – Prevents pinned pieces from making illegal moves.  

#### 🖥 User Interface  
- **Undo & Redo System** – Allows reversing and reapplying moves dynamically.  
- **Themed Piece Sets & Board Designs** – Supports multiple styles for visual customization.

# Add your own theme
It's just a matter of **adding the name** and icon of your theme in **themes/themes.json**.
the name in themes.json **must** match the theme directory name

The directory structure of your theme should look like this
```
. 
├── themes/ 
│   ├── themes.json 
│   ├── <your-theme>/ 
│   │   ├── theme.json 
│   │   ├── black/ 
│   │   │   ├── pawn.png 
│   │   │   ├── rook.png 
│   │   │   ├── knight.png 
│   │   │   ├── bishop.png 
│   │   │   ├── queen.png 
│   │   │   └── king.png 
│   │   ├── white/ 
│   │   │   ├── white pieces 
|   |   |   | ... 
│   │   ├── background image 
│   │   ├── checkmate image (Images for checkmate and stalement popups) 
│   │   └── stalemate image (these must be mentioned in theme.json) 
```

theme.json allows for the following customizations:

- `light_color`: Default is `"white"`
- `dark_color`: Default is `"grey"`
- `white_cell_image`: Default is `null`
- `black_cell_image`: Default is `null`, fallback to respective colors if not provided
- `logo_color`: Default is `"black"`
- `background_color`: Default is `"white"`,
- `background_image`: Default is `null`, fallback to `background_color` if not provided
- `movable_color`: Default is `"lightgreen"`
- `kill_color`: Default is `"#F00"`
- `check_color`: Default is `"#F00"`
- `checkmate_image`: Default is `null`
- `stalemate_image`: Default is `null`

It would be greatly appreciated if you decide to make your own theme and share it, you will be credited.

## Icon/Image Credits:
**FlatIcon:**
- Rizal2109 - *default theme piece icons* 
- Good Ware - *desert theme piece icons*
- Smashicons - *default Checkmate image*
- pixel perfect - *default Stalemate image*
- allsom, handicon, lutfix - *other icons*
