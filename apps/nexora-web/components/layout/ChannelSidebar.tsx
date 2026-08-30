"use client";

import Link from "next/link";

type Channel = {
  id: string;
  name: string;
  type: string;
};

type Props = {
  serverId: string;
  serverName: string;
  channels: Channel[];
  activeChannelId?: string;
};

export default function ChannelSidebar({
  serverId,
  serverName,
  channels,
  activeChannelId,
}: Props) {
  return (
    <aside className="channel-sidebar">
      <header className="channel-server-header">
        <span>{serverName}</span>

        <button
          type="button"
          className="channel-server-menu"
          title="Opções do servidor"
        >
          ⋮
        </button>
      </header>

      <div className="channel-content">
        <div className="channel-category">
          <span>CANAIS DE TEXTO</span>
        </div>

        <div className="channel-list">
          {channels.map((channel) => {
            const active = channel.id === activeChannelId;

            return (
              <Link
                key={channel.id}
                href={`/servers/${serverId}/${channel.id}`}
                className={`channel-item ${
                  active ? "active" : ""
                }`}
              >
                <span className="channel-hash">#</span>
                <span>{channel.name}</span>
              </Link>
            );
          })}

          {channels.length === 0 && (
            <p className="channel-empty">
              Nenhum canal disponível.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}