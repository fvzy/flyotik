import React from 'react';
import {
  Center,
  Button,
  Tabs,
  Card,
  Text,
  Image,
  Skeleton,
  Alert,
  Space,
  List,
  Avatar,
} from '@mantine/core';
import { IconReportSearch, IconMessageCircle, IconDeviceFloppy, IconShare, IconCaretRight, IconAlertCircle, IconHistory } from '@tabler/icons';
import VideoHistory from './VideoHistory';
import { db } from '../db';

const VideoResult = ({ video, link, loader, invalidLink }) => {
  const noVideoData = Object.keys(video).length === 0;

  //The best download implementation
  const downloadVideo = (linke, filename, ftype) => {
  fetch(linke, {
        method: "GET"
    })
        .then(response => {
         return response.blob()
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.${ftype}`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again
            save();
        })

  };

  const save = async () => {
    // data.cover data.title data.play
    const id = await db.history.add({
      cover: video.video.cover,
      title: video.title,
      url: link,
    });

    console.log(id);
  };


  return (
    <Tabs
      defaultValue='result'
      keepMounted={false}
      color='grape'
      sx={{ margin: '2em auto', width: '300px' }}
    >
      <Tabs.List position='center'>
        <Tabs.Tab value='result' icon={<IconReportSearch size={14} />}>
          Result
        </Tabs.Tab>
        <Tabs.Tab value='history' icon={<IconHistory size={14} />}>
          History
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value='result' pt='xs'>
        {noVideoData ? null : (
          <Card shadow='sm' p='md' radius='md' withBorder>
            <Card.Section>
              <Image src={video.video.cover} height={200} alt={video.title} />
            </Card.Section>
            <Text weight={500} mt='md'>
              {video.title}
            </Text>     
            <List
      size="xs"
    >
      <List.Item icon={<IconCaretRight size={15} />}>{video.stats.playCount}</List.Item>
      <List.Item icon={<IconDeviceFloppy size={15} />}>{video.stats.saveCount}</List.Item>
      <List.Item icon={<IconShare size={15} />}>{video.stats.shareCount}</List.Item>
      <List.Item icon={<IconMessageCircle size={15} />}>{video.stats.commentCount}</List.Item>
            </List>
            
            <Text size='sm' color='dimmed'>
            
              {video.author.name}
            </Text>
            <Center>
              <Button
                style={{ padding: "3px"}}
                color='grape'
                mt='md'
                onClick={() => downloadVideo(video.video.noWatermark, `${video.author.name}-${video.id}`, "mp4")}
              >
                Download Video
              </Button>
              <Space w="sm" />
              <Button
                style={{ padding: "3px"}}
                color='grape'
                mt='md'
                onClick={() => downloadVideo(video.music.play_url, `${video.author.name}-${video.id}`, "mp3")}
              >
                Download Audio
              </Button>
            </Center>
          </Card>
        )}

        {loader ? (
          <Card shadow='sm' p='md' radius='md' withBorder>
            <Card.Section>
              <Skeleton height={200} />
            </Card.Section>
            <Skeleton height={8} mt='md' />
            <Skeleton height={8} mt='md' />
            <Skeleton height={8} mt='xs' />
            <Skeleton height={8} mt='xs' />
            <Center>
              <Skeleton height={8} mt='md' width='50%' />
            </Center>
          </Card>
        ) : null}

        {invalidLink ? (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title='Invalid link!'
            color='red'
            mt={50}
          >
            Link pasted is not a tiktok link.
          </Alert>
        ) : null}
      </Tabs.Panel>

      <Tabs.Panel value='history' pt='xs'>
        <VideoHistory />
      </Tabs.Panel>
    </Tabs>
  );
};

export default VideoResult;
