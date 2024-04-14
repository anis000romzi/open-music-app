import Link from 'next/link';

function PlaylistItem({ id, name, username }) {
  return (
    <div>
      <Link href={`playlist/${id}`}>
        <p>{name}</p>
        <p>@{username}</p>
      </Link>
    </div>
  );
}

export default PlaylistItem;
