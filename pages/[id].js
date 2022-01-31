import { useEffect } from 'react';

import ReactPlayer from 'react-player';
import { supabase } from '../utils/supabase';

import { premiumContentAtom } from '../atoms';
import { useAtom } from 'jotai';

const LessonDetails = ({ lesson }) => {
  const [premiumContent, setPremiumContent] = useAtom(premiumContentAtom);
  const getPremiumDetails = async () => {
    const { data, error } = await supabase
      .from('premium')
      .select('video_url')
      .eq('id', lesson.id)
      .single();

    if (error) {
      console.log(error);
    }

    setPremiumContent(data?.video_url);
  };

  useEffect(() => {
    getPremiumDetails();
  }, []);
  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-8">
      <h1 className="text-3xl mb-6">{lesson.title}</h1>
      <p>{lesson.description}</p>
      <p>{premiumContent}</p>
      {premiumContent && <ReactPlayer width="100%" url={premiumContent} />}
    </div>
  );
};

export const getStaticPaths = async () => {
  const { data: lessons } = await supabase.from('lesson').select('id');

  const paths = lessons.map(({ id }) => ({
    params: {
      id: id.toString(),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { id } }) => {
  const { data: lesson } = await supabase
    .from('lesson')
    .select('*')
    .eq('id', id)
    .single();

  return {
    props: {
      lesson,
    },
  };
};

export default LessonDetails;
