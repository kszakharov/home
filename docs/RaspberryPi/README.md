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


## Single Boot Recovery

If you're unable to access your Raspberry Pi normally, follow these steps to recover access:

### 1. Modify Boot Configuration

1. Remove the SD card from your Raspberry Pi and insert it into a computer.
2. Locate and open the `cmdline.txt` file on the boot partition.
3. Add `init=/bin/sh` to the end of the first line in this file.

   *Reference: [Raspberry Pi Forums](https://forums.raspberrypi.com/viewtopic.php?t=207589)*

### 2. Boot in Single User Mode

1. Reinsert the SD card into your Raspberry Pi.
2. Power on the device. It should now boot into single user mode.

### 3. Remount Root Partition

Once booted, remount the root partition with write permissions:

```
sudo mount -o remount,rw /dev/mmcblk0p2 /
```

### 4. Change Password

Now you can change the password for your user:

```
passwd <username>
```

Replace `<username>` with your actual username.

### 5. Finish Recovery

1. Shut down the Raspberry Pi.
2. Remove the SD card and reinsert it into your computer.
3. Remove the `init=/bin/sh` addition from `cmdline.txt`.
4. Put the SD card back into the Raspberry Pi.
5. Boot normally with your new password.

## Useful Links

- [How to use Ansible with SSH passwords](https://stackoverflow.com/questions/42835626/ansible-to-use-the-ssh-connection-type-with-passwords-you-must-install-the-s)
- [Raspberry Pi Documentation](https://www.raspberrypi.org/documentation/)
