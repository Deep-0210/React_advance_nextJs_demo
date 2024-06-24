"use client"
import React, { useState } from 'react'
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";

const ConfirmationModal = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);
    return (
        <div>
            <Dialog open={open} handler={handleOpen} placeholder={'mainClass'}>
                <DialogHeader placeholder={'title'} children={'Its a simple dialog.'} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}></DialogHeader>
                <DialogBody placeholder={'description'}>
                    The key to more success is to have a lot of pillows. Put it this way,
                    it took me twenty five years to get these plants, twenty five years of
                    blood sweat and tears, and I&apos;m never giving up, I&apos;m just
                    getting started. I&apos;m up to something. Fan luv.
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={handleOpen}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    )
}

export default ConfirmationModal
