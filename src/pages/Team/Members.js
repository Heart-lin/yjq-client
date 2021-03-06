import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Avatar, Popover, Button, Icon, List, Row, Col, Tree } from 'antd';
import { linkCopyToClipboard } from '@/utils/utils';
import styles from './Members.less';

const { TreeNode, DirectoryTree } = Tree;
@connect(({ team, loading }) => ({
  team,
  teamLoading: loading.effects['team/members'],
  linkLoading: loading.effects['team/membersInvite'],
}))
class Members extends PureComponent {
  state = {
    visible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'team/members',
    });
    dispatch({
      type: 'team/memberInvite',
    });
  }

  handleVisibleChange = visible => {
    this.setState({
      visible,
    });
  };

  handleInviteLinkCreate = link => {
    linkCopyToClipboard(link);
  };

  memberInvite() {
    const { visible } = this.state;
    const {
      team: { inviteToken, status },
    } = this.props;
    const domain = window.location.host;
    const uri = '/user/join?invite=';

    return status === '__OK__' ? (
      <Popover
        placement="bottom"
        content={
          <div className={styles.inviteLink}>
            <p>
              将下面都链接发送给你想要邀请的人，任何点开该链接的人都可以申请加入团队。
              <br />
              {`${domain}${uri}${inviteToken}`}
            </p>
            <Button
              onClick={() => {
                this.handleInviteLinkCreate(`${domain}${uri}${inviteToken}`);
              }}
              type="primary"
              block
            >
              复制链接
            </Button>
          </div>
        }
        title="邀请链接"
        trigger="click"
        visible={visible}
        onVisibleChange={this.handleVisibleChange}
      >
        <Button>
          <Icon type="plus" /> 邀请成员
        </Button>
      </Popover>
    ) : (
      <div />
    );
  }

  renderMenu = () => {
    const data = [
      { text: '所用成员' },
      { text: '新加入成员' },
      { text: '未分配部门成员.' },
      { text: '停用成员.' },
    ];
    return data.map(item => (
      <List.Item key={item.text} className={styles.memberList} style={{ border: 'none' }}>
        <Icon type="user" className={styles.listIcon} />
        {item.text}
      </List.Item>
    ));
  };

  renderDepartment = () => {
    const data = [
      {
        title: '部门一',
        level: '0-0',
        child: [{ title: '一组', level: '0-0-0' }, { title: '二组', level: '0-0-1' }],
      },
      {
        title: '部门二',
        level: '0-1',
        child: [{ title: '一组', level: '0-1-0' }, { title: '二组', level: '0-1-1' }],
      },
      {
        title: '部门三',
        level: '0-2',
        child: [{ title: '一组', level: '0-2-0' }, { title: '二组', level: '0-2-1' }],
      },
      {
        title: '部门四',
        level: '0-3',
        child: [{ title: '一组', level: '0-3-0' }, { title: '二组', level: '0-3-1' }],
      },
      {
        title: '部门五',
        level: '0-4',
        child: [{ title: '一组', level: '0-4-0' }, { title: '二组', level: '0-4-1' }],
      },
      {
        title: '部门六',
        level: '0-5',
        child: [{ title: '一组', level: '0-5-0' }, { title: '二组', level: '0-5-1' }],
      },
    ];
    return data.map(item => (
      <TreeNode title={item.title} key={item.level}>
        {item.child.map(items => (
          <TreeNode title={items.title} key={items.level} isLeaf />
        ))}
      </TreeNode>
    ));
  };

  renderActivities() {
    const {
      team: { members },
    } = this.props;

    return members.map(item => (
      <List.Item className={styles.ListItem} key={item.user_id}>
        <List.Item.Meta
          avatar={<Avatar src={item.avatar} className={styles.avatarPic} />}
          title={
            <span>
              <a className={styles.username}>{item.name}</a>
            </span>
          }
          description={<span className={styles.membertype}>{item.team_role_desc}</span>}
        />
      </List.Item>
    ));
  }

  render() {
    const {
      team: { total },
      teamLoading,
    } = this.props;

    return (
      <div className={styles.content}>
        <Row className={styles.membersList}>
          <Col span={6} className={styles.listCol}>
            <Card className={styles.listCard}>
              <div className={styles.mune}>
                <div className={styles.title}>成员</div>
                <List loading={teamLoading}>{this.renderMenu()}</List>
                <div className={styles.title}>部门</div>
                <DirectoryTree multiple onSelect={this.onSelect} onExpand={this.onExpand}>
                  {this.renderDepartment()}
                </DirectoryTree>
              </div>
            </Card>
          </Col>

          <Col span={18} className={styles.cardCol}>
            <Card
              bodyStyle={{ padding: 0 }}
              bordered={false}
              className={styles.activeCard}
              extra={this.memberInvite()}
              title={`共${total}人`}
              loading={teamLoading}
            >
              <List loading={teamLoading} size="large">
                <div className={styles.activitiesList}>{this.renderActivities()}</div>
              </List>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Members;
