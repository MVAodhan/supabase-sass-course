import { useEffect } from 'react';
import { supabase } from '../utils/supabase';
import Link from 'next/link';

import { userAtom } from '../atoms';
import { useAtom } from 'jotai';

export default function Home({ lessons }) {
  const [user, setUser] = useAtom(userAtom);

  const mergeUser = async () => {
    const sessionUser = supabase.auth.user();

    if (sessionUser) {
      const { data: profile, error } = await supabase
        .from('profile')
        .select('*')
        .eq('id', sessionUser.id)
        .single();

      if (error) {
        console.log(error);
      }

      setUser({ ...sessionUser, ...profile });
    }
  };

  useEffect(() => {
    mergeUser();

    supabase.auth.onAuthStateChange(() => {
      mergeUser();
    });
  }, []);

  console.log(user);

  return (
    <div className="w-full max-w-3xl mx-auto my-16 px-2">
      {lessons.map((lesson) => (
        <Link key={lesson.id} href={`/${lesson.id}`}>
          <a className="p-8 h-40 mb-4 rounded shadow text-xl flex">
            {lesson.title}
          </a>
        </Link>
      ))}
    </div>
  );
}

export const getStaticProps = async () => {
  const { data: lessons } = await supabase.from('lesson').select('*');

  return {
    props: {
      lessons,
    },
  };
};
