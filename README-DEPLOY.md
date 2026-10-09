# GitHub Pages-e site fast rakhar guide (চট্টলার পুজো)

## 1. Sobcheye boro karon: boro file (ekbar korlei hoy)
Local-e file computer-er disk theke ashe, tai lag lage na. GitHub Pages-e prottek visitor-ke **internet diye** shob download korte hoy.

```bash
pip install pillow
python optimize-images.py --dry-run        # age dekhe nao
python optimize-images.py --convert-png    # shrink + boro PNG photo -> JPG (code-er naam nije bodle dey)
```
- `PXL_…jpg`, `IMG_…jpeg` (phone-er ashol photo, 5-10 MB) ar boro `.png` (jemon `Picsart_…png`) ~10 gun chhoto hoy, chokhe farak bojha jay na.
- Original gulo `backup_originals/`-e thake. Oi folder GitHub-e push korba na: `.gitignore` file-e `backup_originals/` likhe dao.

## 2. Video (`promo.mp4`) ar gaan (`sounds/*.mp3`)
```bash
ffmpeg -i promo.mp4 -vf "scale='min(1280,iw)':-2" -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 96k -movflags +faststart promo-small.mp4
ffmpeg -i gaan.mp3 -b:a 128k gaan-small.mp3
```
Tarpor purano file-er jaygay notun ta rakho (nam ek-i rakho). Video ekhon `preload="none"`, tai play na chaplle download hoy na.

## 3. GitHub-er niyom (lag na, kintu "chhobi ashchhe na" hole eta dekho)
- File-er naam **case-sensitive**: `Hero.JPG` ar `hero.jpg` alada. Code-er naam ar file-er naam hubohu mile ki na dekho.
- Naam-e space/bangla rakho na: `hero-durga.jpg` bhalo, `Hero Durga (1).JPG` kharap.
- Page change korar por 1-2 min lage, ar browser-e `Ctrl+F5` dao.

## 4. Ei version-e ja ja already fast kora ache
- Blur (backdrop-filter) 111 theke 20-te, bhari animation-gulo kome/pause hoy, section-gulo screen-er baire render hoy na.
- Mouse-glow ar scroll-handler ekhon frame-e ekbar chole; phone-e glow/ember/blur bondho.
- Facebook post-er iframe screen-er kachakachi na ashle load hoy na (prottek ta ~1 MB).
- Gaan-er cover ar playlist shudhu dekhar somoy load hoy, 13 ta gaan-er request ekhon 1 ta.
- Google Font-er 3-4 ta request ekhon 1 ta; chhobi `loading="lazy"`.
- Mahalaya audio `preload="none"`.

## 5. Check korar upay
Chrome-e site khule `F12` → **Lighthouse** → Mobile → Analyze. "Properly size images" ar "Efficiently encode images" er warning thakle sheta ba-ki boro chhobi.
