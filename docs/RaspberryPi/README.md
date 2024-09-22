# Raspberry Pi

## Initial Set Up

1. Create a Bootable SD Card

At the root of the first partion of your SD card (the filesystem labeled `bootfs`)

2. Create an empty file named `ssh` 
3. Create a file named `userconf.txt`. This file should contain a single line of text, consisting of \<username\>:\<encrypted-password\>.
    ```bash
    echo "<username>:$(openssl passwd -6 '<password>')" > userconf.txt
    ```
4. Create a file named `wpa_supplicant.conf`
    ```
    ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
    update_config=1
    country=<COUNTRY CODE>

    network={
        ssid="<SSID>"
        psk="<password>"
    }
    ```

## Case

### Raspberry Pi 3 Model B+

- Case Details: [View on Printables](https://www.printables.com/model/24942-raspberry-pi-34-b-case).
- 3D Model Files
  - [Case STL File](rpi-3-case.stl): This file contains the 3D model for the main case of the Raspberry Pi 3 Model B+
  - [Cover STL File](rpi-3-cover.stl): This file includes the 3D model for the case cover
