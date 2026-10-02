import { useUser } from '../../contexts/UserContext';
import { cn } from '../../lib/utils';

export function Avatar({ className }) {
  const { profile } = useUser();
  return profile.avatar
    ? <img src={profile.avatar} alt={profile.nickname} className={cn('rounded-full object-cover', className)} />
    : <span aria-label={profile.nickname} className={cn('inline-flex shrink-0 items-center justify-center rounded-full bg-[#deeadf] text-primary font-bold', className)}>{profile.nickname.slice(0, 1)}</span>;
}
