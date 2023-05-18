import{_ as a,o as n,c as e,O as s}from"./chunks/framework.43781440.js";const g=JSON.parse('{"title":"Panduan module","description":"","frontmatter":{},"headers":[],"relativePath":"id_ID/guide/module.md","filePath":"id_ID/guide/module.md"}'),i={name:"id_ID/guide/module.md"},l=s(`<h1 id="panduan-module" tabindex="-1">Panduan module <a class="header-anchor" href="#panduan-module" aria-label="Permalink to &quot;Panduan module&quot;">​</a></h1><p>KernelSU menyediakan mekanisme modul yang mencapai efek memodifikasi direktori sistem dengan tetap menjaga integritas partisi sistem. Mekanisme ini umumnya dikenal sebagai &quot;tanpa sistem&quot;.</p><p>Mekanisme modul KernelSU hampir sama dengan Magisk. Jika Anda terbiasa dengan pengembangan modul Magisk, mengembangkan modul KernelSU sangat mirip. Anda dapat melewati pengenalan modul di bawah ini dan hanya perlu membaca <a href="./difference-with-magisk.html">difference-with-magisk</a>.</p><h2 id="busybox" tabindex="-1">Busybox <a class="header-anchor" href="#busybox" aria-label="Permalink to &quot;Busybox&quot;">​</a></h2><p>KernelSU dikirimkan dengan fitur biner BusyBox yang lengkap (termasuk dukungan penuh SELinux). Eksekusi terletak di <code>/data/adb/ksu/bin/busybox</code>. BusyBox KernelSU mendukung &quot;Mode Shell Standalone Shell&quot; yang dapat dialihkan waktu proses. Apa yang dimaksud dengan mode mandiri ini adalah bahwa ketika dijalankan di shell <code>ash</code> dari BusyBox, setiap perintah akan langsung menggunakan applet di dalam BusyBox, terlepas dari apa yang ditetapkan sebagai <code>PATH</code>. Misalnya, perintah seperti <code>ls</code>, <code>rm</code>, <code>chmod</code> <strong>TIDAK</strong> akan menggunakan apa yang ada di <code>PATH</code> (dalam kasus Android secara default akan menjadi <code>/system/bin/ls</code>, <code> /system/bin/rm</code>, dan <code>/system/bin/chmod</code> masing-masing), tetapi akan langsung memanggil applet BusyBox internal. Ini memastikan bahwa skrip selalu berjalan di lingkungan yang dapat diprediksi dan selalu memiliki rangkaian perintah lengkap, apa pun versi Android yang menjalankannya. Untuk memaksa perintah <em>not</em> menggunakan BusyBox, Anda harus memanggil yang dapat dieksekusi dengan path lengkap.</p><p>Setiap skrip shell tunggal yang berjalan dalam konteks KernelSU akan dieksekusi di shell <code>ash</code> BusyBox dengan mode mandiri diaktifkan. Untuk apa yang relevan dengan pengembang pihak ke-3, ini termasuk semua skrip boot dan skrip instalasi modul.</p><p>Bagi yang ingin menggunakan fitur “Standalone Mode” ini di luar KernelSU, ada 2 cara untuk mengaktifkannya:</p><ol><li>Tetapkan variabel lingkungan <code>ASH_STANDALONE</code> ke <code>1</code><br>Contoh: <code>ASH_STANDALONE=1 /data/adb/ksu/bin/busybox sh &lt;script&gt;</code></li><li>Beralih dengan opsi baris perintah:<br><code>/data/adb/ksu/bin/busybox sh -o mandiri &lt;script&gt;</code></li></ol><p>Untuk memastikan semua shell <code>sh</code> selanjutnya dijalankan juga dalam mode mandiri, opsi 1 adalah metode yang lebih disukai (dan inilah yang digunakan secara internal oleh KernelSU dan manajer KernelSU) karena variabel lingkungan diwariskan ke proses anak.</p><p>::: perbedaan tip dengan Magisk</p><p>BusyBox KernelSU sekarang menggunakan file biner yang dikompilasi langsung dari proyek Magisk. <strong>Berkat Magisk!</strong> Oleh karena itu, Anda tidak perlu khawatir tentang masalah kompatibilitas antara skrip BusyBox di Magisk dan KernelSU karena keduanya persis sama! :::</p><h2 id="kernelsu-module" tabindex="-1">KernelSU module <a class="header-anchor" href="#kernelsu-module" aria-label="Permalink to &quot;KernelSU module&quot;">​</a></h2><p>Modul KernelSU adalah folder yang ditempatkan di <code>/data/adb/modules</code> dengan struktur di bawah ini:</p><div class="language-txt"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">/data/adb/modules</span></span>
<span class="line"><span style="color:#A6ACCD;">├── .</span></span>
<span class="line"><span style="color:#A6ACCD;">├── .</span></span>
<span class="line"><span style="color:#A6ACCD;">|</span></span>
<span class="line"><span style="color:#A6ACCD;">├── $MODID                  &lt;--- The folder is named with the ID of the module</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │      *** Module Identity ***</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── module.prop         &lt;--- This file stores the metadata of the module</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │      *** Main Contents ***</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── system              &lt;--- This folder will be mounted if skip_mount does not exist</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │   ├── ...</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │   ├── ...</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │   └── ...</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │      *** Status Flags ***</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── skip_mount          &lt;--- If exists, KernelSU will NOT mount your system folder</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── disable             &lt;--- If exists, the module will be disabled</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── remove              &lt;--- If exists, the module will be removed next reboot</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │      *** Optional Files ***</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── post-fs-data.sh     &lt;--- This script will be executed in post-fs-data</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── service.sh          &lt;--- This script will be executed in late_start service</span></span>
<span class="line"><span style="color:#A6ACCD;">|   ├── uninstall.sh        &lt;--- This script will be executed when KernelSU removes your module</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── system.prop         &lt;--- Properties in this file will be loaded as system properties by resetprop</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── sepolicy.rule       &lt;--- Additional custom sepolicy rules</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │      *** Auto Generated, DO NOT MANUALLY CREATE OR MODIFY ***</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── vendor              &lt;--- A symlink to $MODID/system/vendor</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── product             &lt;--- A symlink to $MODID/system/product</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── system_ext          &lt;--- A symlink to $MODID/system/system_ext</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │      *** Any additional files / folders are allowed ***</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── ...</span></span>
<span class="line"><span style="color:#A6ACCD;">│   └── ...</span></span>
<span class="line"><span style="color:#A6ACCD;">|</span></span>
<span class="line"><span style="color:#A6ACCD;">├── another_module</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── .</span></span>
<span class="line"><span style="color:#A6ACCD;">│   └── .</span></span>
<span class="line"><span style="color:#A6ACCD;">├── .</span></span>
<span class="line"><span style="color:#A6ACCD;">├── .</span></span></code></pre></div><p>::: perbedaan tip dengan Magisk KernelSU tidak memiliki dukungan bawaan untuk Zygisk, jadi tidak ada konten terkait Zygisk dalam modul. Namun, Anda dapat menggunakan <a href="https://github.com/Dr-TSNG/ZygiskOnKernelSU" target="_blank" rel="noreferrer">ZygiskOnKernelSU</a> untuk mendukung modul Zygisk. Dalam hal ini, konten modul Zygisk identik dengan yang didukung oleh Magisk. :::</p><h3 id="module-prop" tabindex="-1">module.prop <a class="header-anchor" href="#module-prop" aria-label="Permalink to &quot;module.prop&quot;">​</a></h3><p>module.prop adalah file konfigurasi untuk sebuah modul. Di KernelSU, jika modul tidak berisi file ini, maka tidak akan dikenali sebagai modul. Format file ini adalah sebagai berikut:</p><div class="language-txt"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">id=&lt;string&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">name=&lt;string&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">version=&lt;string&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">versioncode=&lt;int&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">author=&lt;string&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">description=&lt;string&gt;</span></span></code></pre></div><ul><li><code>id</code> harus cocok dengan ekspresi reguler ini: <code>^[a-zA-Z][a-zA-Z0-9._-]+$</code><br> contoh: ✓ <code>a_module</code>, ✓ <code>a.module</code>, ✓ <code>module-101</code>, ✗ <code>a module</code>, ✗ <code>1_module</code>, ✗ <code>-a-module</code><br> Ini adalah <strong>pengidentifikasi unik</strong> modul Anda. Anda tidak boleh mengubahnya setelah dipublikasikan.</li><li><code>versionCode</code> harus berupa <strong>integer</strong>. Ini digunakan untuk membandingkan versi</li><li>Lainnya yang tidak disebutkan di atas dapat berupa string <strong>satu baris</strong>.</li><li>Pastikan untuk menggunakan tipe jeda baris <code>UNIX (LF)</code> dan bukan <code>Windows (CR+LF)</code> atau <code>Macintosh (CR)</code>.</li></ul><h3 id="shell-skrip" tabindex="-1">Shell skrip <a class="header-anchor" href="#shell-skrip" aria-label="Permalink to &quot;Shell skrip&quot;">​</a></h3><p>Harap baca bagian <a href="#boot-scripts">Boot Scripts</a> untuk memahami perbedaan antara <code>post-fs-data.sh</code> dan <code>service.sh</code>. Untuk sebagian besar pengembang modul, <code>service.sh</code> sudah cukup baik jika Anda hanya perlu menjalankan skrip boot.</p><p>Di semua skrip modul Anda, harap gunakan <code>MODDIR=\${0%/*}</code> untuk mendapatkan jalur direktori dasar modul Anda; lakukan <strong>TIDAK</strong> hardcode jalur modul Anda dalam skrip.</p><p>::: perbedaan tip dengan Magisk Anda dapat menggunakan variabel lingkungan KSU untuk menentukan apakah skrip berjalan di KernelSU atau Magisk. Jika berjalan di KernelSU, nilai ini akan disetel ke true. :::</p><h3 id="system-directory" tabindex="-1"><code>system</code> directory <a class="header-anchor" href="#system-directory" aria-label="Permalink to &quot;\`system\` directory&quot;">​</a></h3><p>Isi direktori ini akan dihamparkan di atas partisi sistem /sistem menggunakan overlayfs setelah sistem di-boot. Ini berarti bahwa:</p><ol><li>File dengan nama yang sama dengan yang ada di direktori terkait di sistem akan ditimpa oleh file di direktori ini.</li><li>Folder dengan nama yang sama dengan yang ada di direktori terkait di sistem akan digabungkan dengan folder di direktori ini.</li></ol><p>Jika Anda ingin menghapus file atau folder di direktori sistem asli, Anda perlu membuat file dengan nama yang sama dengan file/folder di direktori modul menggunakan <code>mknod filename c 0 0</code>. Dengan cara ini, sistem overlayfs akan secara otomatis &quot;memutihkan&quot; file ini seolah-olah telah dihapus (partisi / sistem sebenarnya tidak diubah).</p><p>Anda juga dapat mendeklarasikan variabel bernama <code>REMOVE</code> yang berisi daftar direktori di <code>customize.sh</code> untuk menjalankan operasi penghapusan, dan KernelSU akan secara otomatis mengeksekusi <code>mknod &lt;TARGET&gt; c 0 0</code> di direktori modul yang sesuai. Misalnya:</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">HAPUS</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#C3E88D;">/sistem/aplikasi/YouTube</span></span>
<span class="line"><span style="color:#C3E88D;">/system/app/Bloatware</span></span>
<span class="line"><span style="color:#89DDFF;">&quot;</span></span></code></pre></div><p>Daftar di atas akan mengeksekusi <code>mknod $MODPATH/system/app/YouTuBe c 0 0</code> dan <code>mknod $MODPATH/system/app/Bloatware c 0 0</code>; dan <code>/system/app/YouTube</code> dan <code>/system/app/Bloatware</code> akan dihapus setelah modul berlaku.</p><p>Jika Anda ingin mengganti direktori di sistem, Anda perlu membuat direktori dengan jalur yang sama di direktori modul Anda, lalu atur atribut <code>setfattr -n trusted.overlay.opaque -v y &lt;TARGET&gt;</code> untuk direktori ini. Dengan cara ini, sistem overlayfs akan secara otomatis mengganti direktori terkait di sistem (tanpa mengubah partisi /sistem).</p><p>Anda dapat mendeklarasikan variabel bernama <code>REPLACE</code> di file <code>customize.sh</code> Anda, yang menyertakan daftar direktori yang akan diganti, dan KernelSU akan secara otomatis melakukan operasi yang sesuai di direktori modul Anda. Misalnya:</p><p>REPLACE=&quot; /system/app/YouTube /system/app/Bloatware &quot;</p><p>Daftar ini akan secara otomatis membuat direktori <code>$MODPATH/system/app/YouTube</code> dan <code>$MODPATH/system/app/Bloatware</code>, lalu jalankan <code>setfattr -n trusted.overlay.opaque -v y $MODPATH/system/app/ YouTube</code> dan <code>setfattr -n trusted.overlay.opaque -v y $MODPATH/system/app/Bloatware</code>. Setelah modul berlaku, <code>/system/app/YouTube</code> dan <code>/system/app/Bloatware</code> akan diganti dengan direktori kosong.</p><p>::: perbedaan tip dengan Magisk</p><p>Mekanisme tanpa sistem KernelSU diimplementasikan melalui overlay kernel, sementara Magisk saat ini menggunakan magic mount (bind mount). Kedua metode implementasi tersebut memiliki perbedaan yang signifikan, tetapi tujuan utamanya sama: untuk memodifikasi file / sistem tanpa memodifikasi partisi / sistem secara fisik. :::</p><p>Jika Anda tertarik dengan overlayfs, disarankan untuk membaca <a href="https://docs.kernel.org/filesystems/overlayfs.html" target="_blank" rel="noreferrer">dokumentasi overlayfs</a> Kernel Linux.</p><h3 id="system-prop" tabindex="-1">system.prop <a class="header-anchor" href="#system-prop" aria-label="Permalink to &quot;system.prop&quot;">​</a></h3><p>File ini mengikuti format yang sama dengan <code>build.prop</code>. Setiap baris terdiri dari <code>[kunci]=[nilai]</code>.</p><h3 id="sepolicy-rule" tabindex="-1">sepolicy.rule <a class="header-anchor" href="#sepolicy-rule" aria-label="Permalink to &quot;sepolicy.rule&quot;">​</a></h3><p>Jika modul Anda memerlukan beberapa tambalan sepolicy tambahan, harap tambahkan aturan tersebut ke dalam file ini. Setiap baris dalam file ini akan diperlakukan sebagai pernyataan kebijakan.</p><h2 id="pemasangan-module" tabindex="-1">Pemasangan module <a class="header-anchor" href="#pemasangan-module" aria-label="Permalink to &quot;Pemasangan module&quot;">​</a></h2><p>Penginstal modul KernelSU adalah modul KernelSU yang dikemas dalam file zip yang dapat di-flash di aplikasi pengelola KernelSU. Pemasang modul KernelSU yang paling sederhana hanyalah modul KernelSU yang dikemas sebagai file zip.</p><div class="language-txt"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">module.zip</span></span>
<span class="line"><span style="color:#A6ACCD;">│</span></span>
<span class="line"><span style="color:#A6ACCD;">├── customize.sh                       &lt;--- (Optional, more details later)</span></span>
<span class="line"><span style="color:#A6ACCD;">│                                           This script will be sourced by update-binary</span></span>
<span class="line"><span style="color:#A6ACCD;">├── ...</span></span>
<span class="line"><span style="color:#A6ACCD;">├── ...  /* The rest of module&#39;s files */</span></span>
<span class="line"><span style="color:#A6ACCD;">│</span></span></code></pre></div><p>:::peringatan Modul KernelSU TIDAK didukung untuk diinstal dalam pemulihan kustom!! :::</p><h3 id="kostumisasi" tabindex="-1">Kostumisasi <a class="header-anchor" href="#kostumisasi" aria-label="Permalink to &quot;Kostumisasi&quot;">​</a></h3><p>Jika Anda perlu menyesuaikan proses penginstalan modul, secara opsional Anda dapat membuat skrip di penginstal bernama <code>customize.sh</code>. Skrip ini akan <em>sourced</em> (tidak dijalankan!) oleh skrip penginstal modul setelah semua file diekstrak dan izin default serta konteks sekon diterapkan. Ini sangat berguna jika modul Anda memerlukan penyiapan tambahan berdasarkan ABI perangkat, atau Anda perlu menyetel izin khusus/konteks kedua untuk beberapa file modul Anda.</p><p>Jika Anda ingin sepenuhnya mengontrol dan menyesuaikan proses penginstalan, nyatakan <code>SKIPUNZIP=1</code> di <code>customize.sh</code> untuk melewati semua langkah penginstalan default. Dengan melakukannya, <code>customize.sh</code> Anda akan bertanggung jawab untuk menginstal semuanya dengan sendirinya.</p><p>Skrip <code>customize.sh</code> berjalan di shell BusyBox <code>ash</code> KernelSU dengan &quot;Mode Mandiri&quot; diaktifkan. Variabel dan fungsi berikut tersedia:</p><h4 id="variable" tabindex="-1">Variable <a class="header-anchor" href="#variable" aria-label="Permalink to &quot;Variable&quot;">​</a></h4><ul><li><code>KSU</code> (bool): variabel untuk menandai bahwa skrip berjalan di lingkungan KernelSU, dan nilai variabel ini akan selalu benar. Anda dapat menggunakannya untuk membedakan antara KernelSU dan Magisk.</li><li><code>KSU_VER</code> (string): string versi dari KernelSU yang diinstal saat ini (mis. <code>v0.4.0</code>)</li><li><code>KSU_VER_CODE</code> (int): kode versi KernelSU yang terpasang saat ini di ruang pengguna (mis. <code>10672</code>)</li><li><code>KSU_KERNEL_VER_CODE</code> (int): kode versi KernelSU yang terpasang saat ini di ruang kernel (mis. <code>10672</code>)</li><li><code>BOOTMODE</code> (bool): selalu <code>true</code> di KernelSU</li><li><code>MODPATH</code> (jalur): jalur tempat file modul Anda harus diinstal</li><li><code>TMPDIR</code> (jalur): tempat di mana Anda dapat menyimpan file untuk sementara</li><li><code>ZIPFILE</code> (jalur): zip instalasi modul Anda</li><li><code>ARCH</code> (string): arsitektur CPU perangkat. Nilainya adalah <code>arm</code>, <code>arm64</code>, <code>x86</code>, atau <code>x64</code></li><li><code>IS64BIT</code> (bool): <code>true</code> jika <code>$ARCH</code> adalah <code>arm64</code> atau <code>x64</code></li><li><code>API</code> (int): level API (versi Android) perangkat (mis. <code>23</code> untuk Android 6.0)</li></ul><p>::: peringatan Di KernelSU, MAGISK_VER_CODE selalu 25200 dan MAGISK_VER selalu v25.2. Tolong jangan gunakan kedua variabel ini untuk menentukan apakah itu berjalan di KernelSU atau tidak. :::</p><h4 id="fungsi" tabindex="-1">Fungsi <a class="header-anchor" href="#fungsi" aria-label="Permalink to &quot;Fungsi&quot;">​</a></h4><div class="language-txt"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">ui_print &lt;msg&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    print &lt;msg&gt; to console</span></span>
<span class="line"><span style="color:#A6ACCD;">    Avoid using &#39;echo&#39; as it will not display in custom recovery&#39;s console</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">abort &lt;msg&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    print error message &lt;msg&gt; to console and terminate the installation</span></span>
<span class="line"><span style="color:#A6ACCD;">    Avoid using &#39;exit&#39; as it will skip the termination cleanup steps</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">set_perm &lt;target&gt; &lt;owner&gt; &lt;group&gt; &lt;permission&gt; [context]</span></span>
<span class="line"><span style="color:#A6ACCD;">    if [context] is not set, the default is &quot;u:object_r:system_file:s0&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">    this function is a shorthand for the following commands:</span></span>
<span class="line"><span style="color:#A6ACCD;">       chown owner.group target</span></span>
<span class="line"><span style="color:#A6ACCD;">       chmod permission target</span></span>
<span class="line"><span style="color:#A6ACCD;">       chcon context target</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">set_perm_recursive &lt;directory&gt; &lt;owner&gt; &lt;group&gt; &lt;dirpermission&gt; &lt;filepermission&gt; [context]</span></span>
<span class="line"><span style="color:#A6ACCD;">    if [context] is not set, the default is &quot;u:object_r:system_file:s0&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">    for all files in &lt;directory&gt;, it will call:</span></span>
<span class="line"><span style="color:#A6ACCD;">       set_perm file owner group filepermission context</span></span>
<span class="line"><span style="color:#A6ACCD;">    for all directories in &lt;directory&gt; (including itself), it will call:</span></span>
<span class="line"><span style="color:#A6ACCD;">       set_perm dir owner group dirpermission context</span></span></code></pre></div><h2 id="boot-scripts" tabindex="-1">Boot scripts <a class="header-anchor" href="#boot-scripts" aria-label="Permalink to &quot;Boot scripts&quot;">​</a></h2><p>Di KernelSU, skrip dibagi menjadi dua jenis berdasarkan mode operasinya: mode post-fs-data dan mode layanan late_start:</p><ul><li>mode pasca-fs-data <ul><li>Tahap ini adalah BLOKIR. Proses boot dijeda sebelum eksekusi selesai, atau 10 detik telah berlalu.</li><li>Skrip dijalankan sebelum modul apa pun dipasang. Ini memungkinkan pengembang modul untuk menyesuaikan modul mereka secara dinamis sebelum dipasang.</li><li>Tahap ini terjadi sebelum Zygote dimulai, yang berarti segalanya di Android</li><li><strong>PERINGATAN:</strong> menggunakan <code>setprop</code> akan menghentikan proses booting! Silakan gunakan <code>resetprop -n &lt;prop_name&gt; &lt;prop_value&gt;</code> sebagai gantinya.</li><li><strong>Hanya jalankan skrip dalam mode ini jika perlu.</strong></li></ul></li><li>mode layanan late_start <ul><li>Tahap ini NON-BLOCKING. Skrip Anda berjalan paralel dengan proses booting lainnya.</li><li><strong>Ini adalah tahap yang disarankan untuk menjalankan sebagian besar skrip.</strong></li></ul></li></ul><p>Di KernelSU, skrip startup dibagi menjadi dua jenis berdasarkan lokasi penyimpanannya: skrip umum dan skrip modul:</p><ul><li>Skrip Umum <ul><li>Ditempatkan di <code>/data/adb/post-fs-data.d</code> atau <code>/data/adb/service.d</code></li><li>Hanya dieksekusi jika skrip disetel sebagai dapat dieksekusi (<code>chmod +x script.sh</code>)</li><li>Skrip di <code>post-fs-data.d</code> berjalan dalam mode post-fs-data, dan skrip di <code>service.d</code> berjalan di mode layanan late_start.</li><li>Modul seharusnya <strong>TIDAK</strong> menambahkan skrip umum selama instalasi</li></ul></li><li>Skrip Modul <ul><li>Ditempatkan di folder modul itu sendiri</li><li>Hanya dijalankan jika modul diaktifkan</li><li><code>post-fs-data.sh</code> berjalan dalam mode post-fs-data, dan <code>service.sh</code> berjalan dalam mode layanan late_start.</li></ul></li></ul><p>Semua skrip boot akan berjalan di shell BusyBox <code>ash</code> KernelSU dengan &quot;Mode Mandiri&quot; diaktifkan.</p>`,60),o=[l];function t(d,p,r,c,u,m){return n(),e("div",null,o)}const y=a(i,[["render",t]]);export{g as __pageData,y as default};
