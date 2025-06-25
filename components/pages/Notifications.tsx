'use client'

import React, { useEffect } from 'react'
import { evmAddress } from "@lens-protocol/client";
import { fetchNotifications } from "@lens-protocol/client/actions";

import { client } from "../../helper/lensClient";

const Notifications = () => {

  useEffect(() => {

    const getNotifications = async () => {

      const resumed = await client.resumeSession();
      if (resumed.isErr()) return console.error(resumed.error);

      const sessionClient = resumed.value;
        
      const result = await fetchNotifications(sessionClient, {});

      if (result.isErr()) {
        return console.error(result.error);
      }

      // items: Array<Notification>
      const { items, pageInfo } = result.value;
      console.log(items);

    }
    getNotifications();
  }, [])

  return (
    <div>Ronald</div>
  )
}

export default Notifications